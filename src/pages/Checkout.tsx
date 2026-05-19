import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductPrice } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  address: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2, "City is required").max(100),
  pincode: z.string().trim().min(6, "Valid pincode required").max(10),
});

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (cart.length === 0 && !success) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = addressSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setProcessing(true);
    // Simulate payment processing
    await new Promise((res) => setTimeout(res, 2000));
    setProcessing(false);
    setSuccess(true);
    clearCart();
    toast({ title: "Payment Successful ✅", description: "Your order will arrive within 7 days" });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in-up max-w-md px-4">
          <CheckCircle2 className="w-20 h-20 mx-auto mb-6 text-foreground" />
          <h1 className="font-heading text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">Payment Successful</h1>
          <p className="text-muted-foreground font-body mb-8">Your order will arrive within 7 days. Thank you for shopping with us!</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-body text-sm uppercase tracking-widest mb-8 hover:opacity-60 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-heading text-4xl font-black uppercase tracking-tight mb-10">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Address */}
          <div>
            <h2 className="font-heading text-lg font-bold uppercase tracking-tight mb-6">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["name", "phone", "city", "pincode"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-body font-semibold uppercase tracking-[0.2em] mb-2">{field}</label>
                  <input
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
                    placeholder={field === "phone" ? "+91 9876543210" : ""}
                  />
                  {errors[field] && <p className="text-destructive text-xs mt-1 font-body">{errors[field]}</p>}
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-xs font-body font-semibold uppercase tracking-[0.2em] mb-2">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors resize-none"
                />
                {errors.address && <p className="text-destructive text-xs mt-1 font-body">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary p-6">
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-4">Order Summary</h3>
            <div className="space-y-2 font-body text-sm">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex justify-between">
                  <span className="text-muted-foreground">{item.product.name} × {item.quantity} (UK {item.size})</span>
                  <span>{formatPrice(getProductPrice(item.product, item.size) * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold uppercase tracking-widest text-xs">Total</span>
                <span className="font-heading text-xl font-bold">{formatPrice(cartTotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full py-4 bg-foreground text-background font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {processing ? "Processing Payment..." : `Pay ${formatPrice(cartTotal)}`}
          </button>
        </form>
      </div>
    </div>
  );
}
