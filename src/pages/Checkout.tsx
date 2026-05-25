import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import { z } from "zod";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

type PaymentMethod = "upi" | "creditCard" | "debitCard" | "netBanking" | "wallet" | "cod";

type CheckoutFormState = {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

type PaymentDetails = {
  upiId: string;
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  bankName: string;
  walletName: string;
};

type PaymentOption = {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof Smartphone;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type PaymentConfigResponse = {
  configured: boolean;
  message?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const API_BASE_CANDIDATES = [
  API_BASE_URL,
  "/api",
  "http://localhost:5000/api",
  "http://localhost:5001/api",
  "http://localhost:5002/api",
  "http://localhost:5003/api",
].filter((value, index, array) => array.indexOf(value) === index);

const fetchPaymentConfig = async (): Promise<{ apiBaseUrl: string; payload: PaymentConfigResponse } | null> => {
  for (const candidate of API_BASE_CANDIDATES) {
    try {
      const response = await fetch(`${candidate}/payments/config`);
      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as PaymentConfigResponse;
      return { apiBaseUrl: candidate, payload };
    } catch {
      continue;
    }
  }

  return null;
};
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID ?? "";

const addressSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  address: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(100),
  pincode: z.string().trim().min(6, "Valid pincode required").max(10),
});

const paymentOptions: PaymentOption[] = [
  { id: "upi", label: "UPI", description: "Pay instantly with UPI ID", icon: Smartphone },
  { id: "creditCard", label: "Credit Card", description: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "debitCard", label: "Debit Card", description: "Debit card checkout", icon: CreditCard },
  { id: "netBanking", label: "Net Banking", description: "Choose your bank", icon: Building2 },
  { id: "wallet", label: "Wallet", description: "PhonePe, Paytm, Amazon Pay", icon: Wallet },
  { id: "cod", label: "Cash on Delivery", description: "Pay when order arrives", icon: Truck },
];

const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"];
const wallets = ["PhonePe", "Paytm", "Amazon Pay", "Google Pay"];

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<CheckoutFormState>({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    upiId: "",
    cardHolderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    bankName: "",
    walletName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [paymentGatewayReady, setPaymentGatewayReady] = useState(true);
  const [paymentGatewayMessage, setPaymentGatewayMessage] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState(API_BASE_URL);

  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
  }, [cart.length, navigate]);

  useEffect(() => {
    let active = true;

    const checkPaymentConfig = async () => {
      const configResult = await fetchPaymentConfig();

      if (!active) {
        return;
      }

      if (configResult) {
        setApiBaseUrl(configResult.apiBaseUrl);
        setPaymentGatewayReady(Boolean(configResult.payload.configured));
        setPaymentGatewayMessage(configResult.payload.configured ? "" : configResult.payload.message || "");
        return;
      }

      setPaymentGatewayReady(true);
      setPaymentGatewayMessage("");
    };

    checkPaymentConfig();
    const intervalId = window.setInterval(checkPaymentConfig, 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const checkoutItems = useMemo(
    () =>
      cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: getProductPrice(item.product, item.size),
        lineTotal: getProductPrice(item.product, item.size) * item.quantity,
        image: item.product.images[0],
      })),
    [cart],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setErrors((current) => ({ ...current, [e.target.name]: "" }));
  };

  const handlePaymentDetailChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "cardNumber" ? formatCardNumber(value) : value;
    setPaymentDetails((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateCheckout = () => {
    const nextErrors: Record<string, string> = {};
    const parsed = addressSchema.safeParse(form);

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        nextErrors[issue.path[0] as string] = issue.message;
      });
    }

    if (paymentMethod === "upi" && !/^[\w.-]{2,}@[\w.-]{2,}$/.test(paymentDetails.upiId.trim())) {
      nextErrors.upiId = "Enter a valid UPI ID";
    }

    if (paymentMethod === "creditCard" || paymentMethod === "debitCard") {
      if (paymentDetails.cardHolderName.trim().length < 2) nextErrors.cardHolderName = "Cardholder name is required";
      if (paymentDetails.cardNumber.replace(/\s/g, "").length < 12) nextErrors.cardNumber = "Card number is required";
      if (!/^(0[1-9]|1[0-2])$/.test(paymentDetails.expiryMonth.trim())) nextErrors.expiryMonth = "Valid month required";
      if (!/^\d{2}$/.test(paymentDetails.expiryYear.trim())) nextErrors.expiryYear = "Valid year required";
      if (!/^\d{3,4}$/.test(paymentDetails.cvv.trim())) nextErrors.cvv = "Valid CVV required";
    }

    if (paymentMethod === "netBanking" && !paymentDetails.bankName.trim()) nextErrors.bankName = "Please choose a bank";
    if (paymentMethod === "wallet" && !paymentDetails.walletName.trim()) nextErrors.walletName = "Please choose a wallet";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createOrder = async () => {
    const response = await fetch(`${apiBaseUrl}/orders/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: {
          name: form.name,
          phoneNumber: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        items: checkoutItems,
        totalAmount: cartTotal,
        paymentMethod,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Unable to create order");
    }

    return payload;
  };

  const openRazorpayCheckout = async (orderPayload: { orderId: string; razorpayOrderId: string; keyId: string }) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error("Razorpay checkout could not be loaded");
    }

    const checkoutKey = orderPayload.keyId || RAZORPAY_KEY_ID;
    if (!checkoutKey) {
      throw new Error("Razorpay key is missing on server/frontend configuration");
    }

    const options = {
      key: checkoutKey,
      amount: Math.round(cartTotal * 100),
      currency: "INR",
      name: "Shoes Luxury",
      description: `Order ${orderPayload.orderId}`,
      order_id: orderPayload.razorpayOrderId,
      prefill: { name: form.name, contact: form.phone },
      theme: { color: "#111111" },
      modal: { ondismiss: () => setProcessing(false) },
      handler: async (response: RazorpayResponse) => {
        try {
          const verifyResponse = await fetch(`${apiBaseUrl}/orders/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderPayload.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customer: {
                name: form.name,
                phoneNumber: form.phone,
                address: form.address,
                city: form.city,
                pincode: form.pincode,
              },
              items: checkoutItems,
              totalAmount: cartTotal,
              paymentMethod,
            }),
          });

          const verifyPayload = await verifyResponse.json();
          if (!verifyResponse.ok) {
            throw new Error(verifyPayload.message || "Unable to verify payment");
          }

          clearCart();
          toast({ title: "Payment successful", description: "Your order has been confirmed." });
          navigate(`/order-success/${verifyPayload.order.orderId}`, { replace: true });
        } catch (verifyError) {
          const message = verifyError instanceof Error ? verifyError.message : "Unable to verify payment";
          toast({ title: "Payment verification failed", description: message });
          setProcessing(false);
        }
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const placeOrder = async () => {
    setProcessing(true);

    try {
      if (!validateCheckout()) {
        setProcessing(false);
        return;
      }

      if (paymentMethod === "cod") {
        const payload = await createOrder();
        clearCart();
        toast({ title: "Order placed", description: "Cash on delivery order confirmed." });
        navigate(`/order-success/${payload.order.orderId}`, { replace: true });
        return;
      }

      const payload = await createOrder();
      await openRazorpayCheckout(payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to place order";
      toast({ title: "Checkout error", description: message });
      setProcessing(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await placeOrder();
  };

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground transition-opacity hover:opacity-70"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="mb-8 flex flex-col gap-4 border border-border bg-secondary/40 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Secure checkout</p>
            <h1 className="mt-2 font-heading text-4xl font-black uppercase tracking-tight">Payment gateway</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Razorpay test mode ready
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-8">
            <section className="border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-lg font-bold uppercase tracking-tight">Delivery details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {(["name", "phone", "city", "pincode"] as const).map((field) => (
                  <div key={field}>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">{field}</label>
                    <input
                      name={field}
                      value={form[field]}
                      onChange={handleChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder={field === "phone" ? "+91 9876543210" : ""}
                    />
                    {errors[field] && <p className="mt-1 text-xs text-destructive">{errors[field]}</p>}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Address</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={4}
                    className="w-full resize-none border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                    placeholder="Flat, street, landmark"
                  />
                  {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                </div>
              </div>
            </section>

            <section className="border border-border bg-background p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-heading text-lg font-bold uppercase tracking-tight">Select payment method</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Choose how you want to pay.</p>
                </div>
                <span className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Razorpay key served by backend
                </span>
              </div>

              {!paymentGatewayReady && paymentGatewayMessage && (
                <div className="mb-4 border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {paymentGatewayMessage || "Razorpay is not configured correctly in backend."}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon;
                  const active = paymentMethod === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setPaymentMethod(option.id)}
                      className={`flex min-h-[110px] flex-col justify-between border p-4 text-left transition-all ${active ? "border-foreground bg-foreground text-background" : "border-border bg-secondary/20 hover:border-foreground/60"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Icon className="h-5 w-5" />
                        <span className={`text-xs uppercase tracking-[0.3em] ${active ? "text-background/70" : "text-muted-foreground"}`}>{active ? "Selected" : "Choose"}</span>
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold uppercase tracking-widest">{option.label}</p>
                        <p className={`mt-2 text-xs ${active ? "text-background/70" : "text-muted-foreground"}`}>{option.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-6 font-heading text-lg font-bold uppercase tracking-tight">Payment details</h2>

              {paymentMethod === "upi" && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">UPI ID</label>
                  <input
                    name="upiId"
                    value={paymentDetails.upiId}
                    onChange={handlePaymentDetailChange}
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                    placeholder="name@bank"
                  />
                  {errors.upiId && <p className="mt-1 text-xs text-destructive">{errors.upiId}</p>}
                </div>
              )}

              {(paymentMethod === "creditCard" || paymentMethod === "debitCard") && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Cardholder name</label>
                    <input
                      name="cardHolderName"
                      value={paymentDetails.cardHolderName}
                      onChange={handlePaymentDetailChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="Name on card"
                    />
                    {errors.cardHolderName && <p className="mt-1 text-xs text-destructive">{errors.cardHolderName}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Card number</label>
                    <input
                      name="cardNumber"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentDetailChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="mt-1 text-xs text-destructive">{errors.cardNumber}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Expiry month</label>
                    <input
                      name="expiryMonth"
                      value={paymentDetails.expiryMonth}
                      onChange={handlePaymentDetailChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="MM"
                    />
                    {errors.expiryMonth && <p className="mt-1 text-xs text-destructive">{errors.expiryMonth}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Expiry year</label>
                    <input
                      name="expiryYear"
                      value={paymentDetails.expiryYear}
                      onChange={handlePaymentDetailChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="YY"
                    />
                    {errors.expiryYear && <p className="mt-1 text-xs text-destructive">{errors.expiryYear}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">CVV</label>
                    <input
                      name="cvv"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentDetailChange}
                      className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                      placeholder="123"
                    />
                    {errors.cvv && <p className="mt-1 text-xs text-destructive">{errors.cvv}</p>}
                  </div>
                </div>
              )}

              {paymentMethod === "netBanking" && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Choose your bank</label>
                  <select
                    name="bankName"
                    value={paymentDetails.bankName}
                    onChange={handlePaymentDetailChange}
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                  >
                    <option value="">Select bank</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  {errors.bankName && <p className="mt-1 text-xs text-destructive">{errors.bankName}</p>}
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Choose wallet</label>
                  <select
                    name="walletName"
                    value={paymentDetails.walletName}
                    onChange={handlePaymentDetailChange}
                    className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-foreground"
                  >
                    <option value="">Select wallet</option>
                    {wallets.map((wallet) => (
                      <option key={wallet} value={wallet}>
                        {wallet}
                      </option>
                    ))}
                  </select>
                  {errors.walletName && <p className="mt-1 text-xs text-destructive">{errors.walletName}</p>}
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="border border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold uppercase tracking-[0.25em] text-foreground">Cash on delivery</p>
                  <p className="mt-2">Your order will be confirmed now and payment will be collected at delivery.</p>
                </div>
              )}
            </section>

            <button
              type="submit"
              disabled={processing}
              className="flex w-full items-center justify-center gap-2 bg-foreground px-6 py-4 text-sm font-semibold uppercase tracking-[0.35em] text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>Pay Now · {formatPrice(cartTotal)}</>
              )}
            </button>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <section className="border border-border bg-background p-6 shadow-sm">
              <h3 className="mb-4 font-heading text-lg font-bold uppercase tracking-tight">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">UK {item.size} · Qty {item.quantity}</p>
                    </div>
                    <span>{formatPrice(getProductPrice(item.product, item.size) * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-border pt-3 text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-medium text-foreground">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Total</span>
                  <span className="font-heading text-2xl font-black">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </section>

            <section className="border border-border bg-secondary/20 p-6">
              <div className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                <p className="font-heading text-sm font-bold uppercase tracking-widest">Secure payment</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">UPI, cards, wallets, net banking, and COD are available in a premium Razorpay checkout.</p>
            </section>
          </aside>
        </form>
      </div>
    </div>
  );
}
