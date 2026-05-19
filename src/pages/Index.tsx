import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { products, brands } from "@/data/products";

const limitedProducts = products.filter((p) => p.isLimited);

export default function Index() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Marquee */}
      <div className="bg-foreground overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
            <span key={i} className="text-background/40 font-heading text-sm font-bold uppercase tracking-[0.4em] mx-8">
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Limited Edition */}
      <section className="container mx-auto px-4 md:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.3em] mb-2">Exclusive</p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tight">Limited Edition</h2>
          </div>
          <Link to="/shoes" className="hidden md:flex items-center gap-2 font-body text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {limitedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <Link to="/shoes" className="md:hidden flex items-center justify-center gap-2 mt-10 font-body text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity">
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* CTA Banner */}
      <section className="luxury-gradient py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-primary-foreground/50 font-body text-xs uppercase tracking-[0.4em] mb-4">Free Shipping Worldwide</p>
          <h2 className="text-primary-foreground font-heading text-4xl md:text-6xl font-black uppercase tracking-tight mb-8">
            Explore The Collection
          </h2>
          <Link
            to="/shoes"
            className="inline-flex items-center gap-3 border border-primary-foreground/30 text-primary-foreground px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:bg-primary-foreground hover:text-primary transition-all"
          >
            Shop All Shoes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
