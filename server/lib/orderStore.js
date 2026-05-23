const mysql = require('mysql2/promise');

let pool;

const getConnectionConfig = () => {
  const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

  if (!MYSQL_HOST || !MYSQL_USER || !MYSQL_PASSWORD || !MYSQL_DATABASE) {
    throw new Error('MySQL environment variables are not fully configured');
  }

  return {
    host: MYSQL_HOST,
    port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    multipleStatements: false,
  };
};

const ensurePool = () => {
  if (!pool) {
    pool = mysql.createPool(getConnectionConfig());
  }

  return pool;
};

const initOrderStore = async () => {
  const db = ensurePool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      order_id VARCHAR(64) NOT NULL,
      customer_name VARCHAR(150) NOT NULL,
      phone_number VARCHAR(30) NOT NULL,
      address VARCHAR(500) NOT NULL,
      city VARCHAR(120) NOT NULL,
      pincode VARCHAR(20) NOT NULL,
      items LONGTEXT NOT NULL,
      total_amount DECIMAL(12,2) NOT NULL,
      payment_method VARCHAR(60) NOT NULL,
      payment_status VARCHAR(40) NOT NULL,
      razorpay_order_id VARCHAR(120) DEFAULT NULL,
      payment_id VARCHAR(120) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uq_orders_order_id (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
};

const serializeItems = (items) => JSON.stringify(Array.isArray(items) ? items : []);

const parseOrderRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    orderId: row.order_id,
    customerName: row.customer_name,
    phoneNumber: row.phone_number,
    address: row.address,
    city: row.city,
    pincode: row.pincode,
    items: typeof row.items === 'string' ? JSON.parse(row.items || '[]') : row.items || [],
    totalAmount: Number(row.total_amount),
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    razorpayOrderId: row.razorpay_order_id || '',
    paymentId: row.payment_id || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const createOrderRecord = async (order) => {
  const db = ensurePool();
  const [result] = await db.query(
    `
      INSERT INTO orders (
        order_id,
        customer_name,
        phone_number,
        address,
        city,
        pincode,
        items,
        total_amount,
        payment_method,
        payment_status,
        razorpay_order_id,
        payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      order.orderId,
      order.customerName,
      order.phoneNumber,
      order.address,
      order.city,
      order.pincode,
      serializeItems(order.items),
      Number(order.totalAmount),
      order.paymentMethod,
      order.paymentStatus,
      order.razorpayOrderId || null,
      order.paymentId || null,
    ],
  );

  return { insertId: result.insertId, ...order };
};

const updateOrderPayment = async ({ orderId, paymentStatus, paymentId, razorpayOrderId, paymentMethod }) => {
  const db = ensurePool();
  await db.query(
    `
      UPDATE orders
      SET payment_status = COALESCE(?, payment_status),
          payment_id = COALESCE(?, payment_id),
          razorpay_order_id = COALESCE(?, razorpay_order_id),
          payment_method = COALESCE(?, payment_method)
      WHERE order_id = ?
    `,
    [paymentStatus || null, paymentId || null, razorpayOrderId || null, paymentMethod || null, orderId],
  );
};

const findOrderById = async (orderId) => {
  const db = ensurePool();
  const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ? LIMIT 1', [orderId]);
  return parseOrderRow(rows[0]);
};

module.exports = {
  initOrderStore,
  createOrderRecord,
  updateOrderPayment,
  findOrderById,
};
