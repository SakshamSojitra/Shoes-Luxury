import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Loader2, MapPin, Package2, Phone, Clock3, ReceiptText } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

type OrderItem = {
  productName: string;
  quantity: number;
  size: number;
  lineTotal: number;
};

type OrderDetails = {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_BASE_CANDIDATES = [
  API_BASE_URL,
  "/api",
  "http://localhost:5000/api",
  "http://localhost:5001/api",
  "http://localhost:5002/api",
  "http://localhost:5003/api",
].filter((value, index, array) => array.indexOf(value) === index);

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        for (const candidate of API_BASE_CANDIDATES) {
          try {
            const response = await fetch(`${candidate}/orders/${orderId}`);
            if (!response.ok) {
              continue;
            }

            const payload = await response.json();
            setOrder(payload.order);
            return;
          } catch {
            continue;
          }
        }

        throw new Error("Unable to load order from backend");
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Unable to load order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      loadOrder();
    } else {
      setError("Order ID is missing");
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p className="font-body text-sm uppercase tracking-widest text-muted-foreground">Loading order details</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-4">Order not found</h1>
          <p className="font-body text-muted-foreground mb-8">{error || "We could not load your payment result."}</p>
          <button
            onClick={() => navigate("/shoes")}
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="border border-border bg-background shadow-sm">
          <div className="border-b border-border px-6 py-8 text-center md:px-10">
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16" />
            <p className="text-xs font-body uppercase tracking-[0.35em] text-muted-foreground">Order confirmed</p>
            <h1 className="mt-3 font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">Success</h1>
            <p className="mt-4 font-body text-muted-foreground">Your payment has been saved and your order is ready for processing.</p>
          </div>

          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.2fr_0.8fr] md:px-10">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order ID</p>
                  <p className="mt-2 font-heading text-lg font-bold uppercase tracking-widest">{order.orderId}</p>
                </div>
                <div className="border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Payment</p>
                  <p className="mt-2 font-heading text-lg font-bold uppercase tracking-widest">{order.paymentStatus}</p>
                </div>
                <div className="border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Method</p>
                  <p className="mt-2 font-heading text-lg font-bold uppercase tracking-widest">{order.paymentMethod}</p>
                </div>
                <div className="border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Total</p>
                  <p className="mt-2 font-heading text-lg font-bold uppercase tracking-widest">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              <div className="border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Package2 className="h-4 w-4" />
                  <h2 className="font-heading text-lg font-bold uppercase tracking-tight">Order Items</h2>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${item.productName}-${index}`} className="flex items-center justify-between border-b border-border pb-3 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-body text-sm font-medium">{item.productName}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">UK {item.size} · Qty {item.quantity}</p>
                      </div>
                      <p className="font-heading text-sm font-bold">{formatPrice(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptText className="h-4 w-4" />
                  <h2 className="font-heading text-lg font-bold uppercase tracking-tight">Customer Details</h2>
                </div>
                <div className="space-y-4 text-sm font-body">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">Name</p>
                    <p>{order.customerName}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-4 w-4" />
                    <p>{order.phoneNumber}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4" />
                    <p>
                      {order.address}, {order.city}, {order.pincode}
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 className="mt-0.5 h-4 w-4" />
                    <p>{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="border border-border p-5 bg-secondary">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Payment ID</p>
                <p className="mt-2 break-all font-body text-sm">{order.paymentId || "Pending for COD"}</p>
              </div>

              <Link
                to="/shoes"
                className="block text-center bg-foreground text-background px-6 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}