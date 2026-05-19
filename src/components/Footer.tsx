import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-black uppercase tracking-tight mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>KickKart</h3>
            <p className="font-body text-white text-sm max-w-sm leading-relaxed">
              Premium sneakers from the world's most coveted brands. Free shipping on every order.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.3em] mb-4 text-white">Shop</h4>
            <div className="flex flex-col gap-2 text-sm font-body text-white">
              <Link to="/shoes" className="hover:opacity-70 transition-opacity">All Shoes</Link>
              <Link to="/shoes?brand=Nike" className="hover:opacity-70 transition-opacity">Nike</Link>
              <Link to="/shoes?brand=Adidas" className="hover:opacity-70 transition-opacity">Adidas</Link>
              <Link to="/shoes?brand=Puma" className="hover:opacity-70 transition-opacity">Puma</Link>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-[0.3em] mb-4 text-white">Info</h4>
            <div className="flex flex-col gap-2 text-sm font-body text-white">
              <span>Free Shipping on All Orders</span>
              <span>7-Day Delivery</span>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-xs font-body text-white uppercase tracking-widest">
          © 2026 KickKart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
