const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Razorpay = require('razorpay'); 
const { initOrderStore, createOrderRecord, updateOrderPayment, findOrderById } = require('./lib/orderStore');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const productsPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_PORT = Number(process.env.PORT || 5000);
const MAX_PORT_ATTEMPTS = 10;

const PAYMENT_METHODS = {
  upi: 'UPI Payment',
  creditCard: 'Credit Card',
  debitCard: 'Debit Card',
  netBanking: 'Net Banking',
  wallet: 'Wallet',
  cod: 'Cash on Delivery',
};

const normalizePaymentMethod = (paymentMethod) => {
  const key = String(paymentMethod || '').toLowerCase().replace(/[^a-z]/g, '');
  if (key.includes('cod') || key.includes('cashondelivery')) return PAYMENT_METHODS.cod;
  if (key.includes('credit')) return PAYMENT_METHODS.creditCard;
  if (key.includes('debit')) return PAYMENT_METHODS.debitCard;
  if (key.includes('netbank')) return PAYMENT_METHODS.netBanking;
  if (key.includes('wallet')) return PAYMENT_METHODS.wallet;
  return PAYMENT_METHODS.upi;
};

const generateOrderId = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SL-${stamp}-${random}`;
};

const buildOrderItems = (items = []) =>
  items.map((item) => ({
    productId: String(item.productId ?? item.id ?? ''),
    productName: item.productName || item.name || 'Product',
    size: Number(item.size || 0),
    quantity: Number(item.quantity || 1),
    unitPrice: Number(item.unitPrice || item.price || 0),
    lineTotal: Number(item.lineTotal || Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1)),
    image: item.image || '',
  }));

const createRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'Shoes Luxury backend is running',
    routes: ['/api/health', '/api/products', '/api/orders/create-order'],
  });
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((entry) => String(entry.id) === String(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(product);
});

app.post('/api/orders/create-order', async (req, res, next) => {
  try {
    const { customer = {}, items = [], totalAmount = 0, paymentMethod = PAYMENT_METHODS.upi } = req.body || {};

    const customerName = String(customer.name || '').trim();
    const phoneNumber = String(customer.phoneNumber || '').trim();
    const address = String(customer.address || '').trim();
    const city = String(customer.city || '').trim();
    const pincode = String(customer.pincode || '').trim();
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);
    const orderItems = buildOrderItems(items);
    const amountValue = Number(totalAmount);

    if (!customerName || !phoneNumber || !address || !city || !pincode || orderItems.length === 0 || !Number.isFinite(amountValue) || amountValue <= 0) {
      return res.status(400).json({ message: 'Missing checkout details' });
    }

    if (normalizedPaymentMethod === PAYMENT_METHODS.cod) {
      const savedOrder = await Order.create({
        orderId: generateOrderId(),
        customerName,
        phoneNumber,
        address,
        city,
        pincode,
        items: orderItems,
        totalAmount: amountValue,
        paymentMethod: normalizedPaymentMethod,
        paymentStatus: 'Pending',
      });

      return res.status(201).json({
        message: 'Order placed successfully',
        order: savedOrder,
      });
    }

    const razorpay = createRazorpayClient();
    if (!razorpay) {
      return res.status(503).json({
        message: 'Razorpay is not configured in server/.env. Falling back to Cash on Delivery is available.',
        razorpayConfigured: false,
      });
    }

    const orderId = generateOrderId();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amountValue * 100),
      currency: 'INR',
      receipt: orderId,
      notes: {
        customerName,
        phoneNumber,
        city,
        pincode,
        paymentMethod: normalizedPaymentMethod,
      },
    });

    return res.status(201).json({
      orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountValue,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentMethod: normalizedPaymentMethod,
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/orders/verify-payment', async (req, res, next) => {
  try {
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customer = {},
      items = [],
      totalAmount = 0,
      paymentMethod = PAYMENT_METHODS.upi,
    } = req.body || {};

    const customerName = String(customer.name || '').trim();
    const phoneNumber = String(customer.phoneNumber || '').trim();
    const address = String(customer.address || '').trim();
    const city = String(customer.city || '').trim();
    const pincode = String(customer.pincode || '').trim();
    const normalizedPaymentMethod = normalizePaymentMethod(paymentMethod);

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret) {
      return res.status(500).json({ message: 'Razorpay secret is not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const savedOrder = await Order.create({
      orderId,
      customerName,
      phoneNumber,
      address,
      city,
      pincode,
      items: buildOrderItems(items),
      totalAmount: Number(totalAmount),
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: 'Paid',
      razorpayOrderId,
      paymentId: razorpayPaymentId,
    });

    return res.status(201).json({
      message: 'Payment verified successfully',
      order: savedOrder,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/orders/:orderId', async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ order });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const listenOnPort = (port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve({ server, port }));

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        server.close(() => reject(error));
        return;
      }

      reject(error);
    });
  });

const startServer = async () => {
  await connectDB();

  let lastError;
  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset += 1) {
    const port = DEFAULT_PORT + offset;

    try {
      const { server } = await listenOnPort(port);
      console.log(`Server running on http://localhost:${port}`);
      return server;
    } catch (error) {
      lastError = error;
      if (error.code !== 'EADDRINUSE') {
        throw error;
      }
    }
  }

  throw new Error(
    `No available port found starting from ${DEFAULT_PORT}. Last error: ${lastError?.message || 'unknown error'}`,
  );
};

module.exports = { app, startServer };

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
