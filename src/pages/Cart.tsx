import { Link } from "react-router-dom";
import { Minus, Plus, X, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, getProductPrice } from "@/data/products";
import Footer from "@/components/Footer";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-8 py-20 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="font-heading text-3xl font-black uppercase tracking-tight mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground font-body mb-8">Looks like you haven't added anything yet.</p>
          <Link
            to="/shoes"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-10">
        <Link to="/shoes" className="flex items-center gap-2 font-body text-sm uppercase tracking-widest mb-8 hover:opacity-60 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="font-heading text-4xl md:text-5xl font-black uppercase tracking-tight mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex gap-4 md:gap-6 border-b border-border pb-6 animate-fade-in">
                <Link to={`/product/${item.product.id}`} className="w-20 h-20 md:w-24 md:h-24 bg-white flex-shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground font-body uppercase tracking-widest">{item.product.brand}</p>
                      <h3 className="font-heading text-base md:text-lg font-bold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground font-body">Size: UK {item.size}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id, item.size)} className="hover:opacity-60 transition-opacity">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="inline-flex items-center border border-border">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-sm font-body font-medium border-x border-border">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center hover:bg-secondary transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-heading font-bold">{formatPrice(getProductPrice(item.product, item.size) * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-secondary p-6 md:p-8 h-fit">
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-6">Order Summary</h3>
            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold uppercase tracking-widest text-xs">Total</span>
                <span className="font-heading text-xl font-bold">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="block w-full mt-6 py-4 bg-foreground text-background text-center font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
