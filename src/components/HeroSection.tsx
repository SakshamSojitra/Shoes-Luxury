import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.png";
import heroAdidas from "@/assets/Adidas Hero.png";
import hero2 from "@/assets/hero-2.jpg";
import pumaHero from "@/assets/puma-hero.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  { image: hero1, title: "Step Into Luxury", subtitle: "Premium Sneakers Collection 2026" },
  { image: heroAdidas, title: "ICONIC EVERY STEP", subtitle: "Classic Meet Modern Performance" },
  { image: pumaHero, title: "FOREVER FAST", subtitle: "Built For Every You" },
  { image: hero1, title: "Urban Classics", subtitle: "Street Style, Elevated Comfort" },
  { image: hero2, title: "Built For Speed", subtitle: "Engineered For Everyday Motion" },
  { image: hero3, title: "Signature Picks", subtitle: "Curated Sneakers For Every Look" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden luxury-gradient">
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: current === i ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-70"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />

      <div className="absolute inset-0 flex items-end">
        <div className="container mx-auto px-4 md:px-8 pb-16 md:pb-24">
          <div key={current} className="animate-fade-in-up">
            <p className="text-primary-foreground/70 font-body text-sm md:text-base tracking-[0.3em] uppercase mb-3">
              {slides[current].subtitle}
            </p>
            <h1 className="text-primary-foreground font-heading text-5xl md:text-8xl font-black uppercase tracking-tight leading-none mb-8">
              {slides[current].title}
            </h1>
            <Link
              to="/shoes"
              className="inline-flex items-center gap-3 bg-primary-foreground text-primary px-8 py-4 font-body text-sm font-semibold uppercase tracking-widest hover:opacity-80 transition-opacity"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 transition-all duration-500 ${
                  current === i ? "w-12 bg-primary-foreground" : "w-6 bg-primary-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
