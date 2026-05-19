import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const location = useLocation();
  const from = `${location.pathname}${location.search}`;
  const { toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);
  const imageClass =
    product.id === "1"
      ? "w-full h-full object-contain p-0 scale-[1.22] transition-transform duration-700 group-hover:scale-[1.27]"
      : product.id === "15"
      ? "w-full h-full object-contain p-0 scale-[1.12] transition-transform duration-700 group-hover:scale-[1.16]"
      : product.id === "9"
      ? "w-full h-full object-contain p-0 scale-[1.2] transition-transform duration-700 group-hover:scale-[1.24]"
      : product.id === "8"
        ? "w-full h-full object-contain p-0 scale-[1.14] transition-transform duration-700 group-hover:scale-[1.18]"
      : product.id === "2"
        ? "w-full h-full object-contain p-1 scale-110 transition-transform duration-700 group-hover:scale-[1.15]"
        : "w-full h-full object-contain p-1 scale-110 transition-transform duration-700 group-hover:scale-[1.15]";

  return (
    <div
      className="group animate-fade-in"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <Link to={`/product/${product.id}`} state={{ from }} className="block">
        <div className="relative aspect-square overflow-hidden bg-white mb-4 flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.name}
            className={imageClass}
          />
          {product.isLimited && (
            <span className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-[10px] font-body font-bold uppercase tracking-widest">
              Limited
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${wishlisted ? "fill-foreground text-foreground" : "text-foreground"}`}
            />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-12 bg-foreground/90 transition-all duration-300 flex items-center justify-center overflow-hidden">
            <span className="text-white !text-white text-xs font-body font-semibold uppercase tracking-widest">View Product</span>
          </div>
        </div>
      </Link>
      <div>
        <p className="text-xs text-muted-foreground font-body uppercase tracking-widest mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} state={{ from }}>
          <h3 className="font-heading text-base font-semibold hover:opacity-60 transition-opacity">{product.name}</h3>
        </Link>
        <p className="font-body text-sm font-medium mt-1">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}
