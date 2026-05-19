import { useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, Truck } from "lucide-react";
import { products, formatPrice, getProductPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Footer from "@/components/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const backTo = (location.state as { from?: string } | null)?.from || "/shoes";

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shoes" className="font-body text-sm underline">Back to shoes</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const displayPrice = getProductPrice(product, selectedSize ?? undefined);
  const detailImageClass =
    product.id === "1"
      ? "w-full h-full object-contain p-2 scale-105 animate-scale-in"
      : product.id === "15"
      ? "w-full h-full object-contain p-2 scale-105 animate-scale-in"
      : product.id === "2"
      ? "w-full h-full object-contain p-3 scale-105 animate-scale-in"
      : product.id === "8"
        ? "w-full h-full object-contain p-4 scale-105 animate-scale-in"
      : "w-full h-full object-contain p-6 animate-scale-in";
  const thumbImageClass =
    product.id === "1"
      ? "w-full h-full object-contain p-0 scale-105"
      : product.id === "15"
      ? "w-full h-full object-contain p-0 scale-105"
      : product.id === "2"
      ? "w-full h-full object-contain p-0 scale-105"
      : product.id === "8"
        ? "w-full h-full object-contain p-0 scale-105"
      : "w-full h-full object-contain p-1";

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <button onClick={() => navigate(backTo)} className="flex items-center gap-2 font-body text-sm uppercase tracking-widest mb-8 hover:opacity-60 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-secondary overflow-hidden flex items-center justify-center">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={detailImageClass}
                key={selectedImage}
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 bg-secondary overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-foreground" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className={thumbImageClass} />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="animate-fade-in">
            <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.3em] mb-2">{product.brand}</p>
            <h1 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">{product.name}</h1>
            <p className="font-heading text-2xl md:text-3xl font-bold mb-6">{formatPrice(displayPrice)}</p>

            <div className="flex items-center gap-2 text-sm font-body text-muted-foreground mb-8">
              <Truck className="w-4 h-4" />
              <span>Free Shipping • Delivered within 7 days</span>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] mb-4">Select Size (UK)</p>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-body font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                      selectedSize === size
                        ? "bg-black text-white border-black hover:bg-black hover:text-white"
                        : "border-border text-foreground hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === null && (
                <p className="text-xs text-muted-foreground mt-2 font-body">Please select a size</p>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] mb-4">Quantity</p>
              <div className="inline-flex items-center border border-border">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-12 flex items-center justify-center font-body font-medium border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full py-4 bg-foreground text-white font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className="w-full py-4 border border-foreground font-body text-sm font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-full py-4 flex items-center justify-center gap-2 border border-border font-body text-sm font-semibold uppercase tracking-widest hover:border-foreground transition-colors"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-foreground" : ""}`} />
                {wishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Description */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.3em] mb-4">Description</p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
