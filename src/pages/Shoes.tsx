import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products, brands, categories } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function Shoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const brandFilter = searchParams.get("brand") || "";
  const categoryFilter = searchParams.get("category") || "";
  const showWishlist = searchParams.get("wishlist") === "true";
  const { wishlist } = useCart();

  const selectedBrand = brandFilter;
  const selectedCategory = categoryFilter;

  const updateFilters = (nextBrand: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams);

    if (nextBrand) params.set("brand", nextBrand);
    else params.delete("brand");

    if (nextCategory) params.set("category", nextCategory);
    else params.delete("category");

    setSearchParams(params);
  };

  const filtered = useMemo(() => {
    let result = products;
    if (showWishlist) result = result.filter((p) => wishlist.includes(p.id));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    return result;
  }, [searchQuery, selectedBrand, selectedCategory, showWishlist, wishlist]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 pt-10 pb-20">
        <div className="mb-10">
          <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.3em] mb-2">
            {showWishlist ? "Your Wishlist" : "Collection"}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-tight">
            {showWishlist ? "Wishlist" : "All Shoes"}
          </h1>
          {searchQuery && (
            <p className="text-muted-foreground font-body text-sm mt-2">
              Results for "{searchQuery}"
            </p>
          )}
        </div>

        {/* Filters */}
        {!showWishlist && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => updateFilters("", "")}
              className={`px-4 py-2 text-xs font-body font-semibold uppercase tracking-widest border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                !selectedBrand && !selectedCategory
                  ? "bg-black text-white border-black hover:bg-black hover:text-white"
                  : "border-border text-foreground hover:border-foreground"
              }`}
            >
              All
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => updateFilters(selectedBrand === b ? "" : b, "")}
                className={`px-4 py-2 text-xs font-body font-semibold uppercase tracking-widest border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                  selectedBrand === b
                    ? "bg-black text-white border-black hover:bg-black hover:text-white"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {b}
              </button>
            ))}
            <div className="w-px bg-border mx-2" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => updateFilters("", selectedCategory === c ? "" : c)}
                className={`px-4 py-2 text-xs font-body font-semibold uppercase tracking-widest border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
                  selectedCategory === c
                    ? "bg-black text-white border-black hover:bg-black hover:text-white"
                    : "border-border text-foreground hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">No shoes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
