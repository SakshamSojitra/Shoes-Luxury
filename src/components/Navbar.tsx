import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shoes?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tight uppercase" style={{ fontFamily: "Poppins, sans-serif" }}>
              KickKart
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 font-body text-sm font-medium tracking-wide uppercase">
              <Link to="/" className="hover:opacity-60 transition-opacity">Home</Link>
              <Link to="/shoes" className="hover:opacity-60 transition-opacity">Shoes</Link>
              <Link to="/cart" className="hover:opacity-60 transition-opacity">Cart</Link>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 md:gap-5">
              <button onClick={() => setSearchOpen(!searchOpen)} className="hover:opacity-60 transition-opacity">
                <Search className="w-5 h-5" />
              </button>
              <Link to="/shoes?wishlist=true" className="relative hover:opacity-60 transition-opacity">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="relative hover:opacity-60 transition-opacity">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button className="hidden md:block hover:opacity-60 transition-opacity">
                <User className="w-5 h-5" />
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-border bg-background animate-fade-in">
            <form onSubmit={handleSearch} className="container mx-auto px-4 md:px-8 py-4">
              <input
                type="text"
                placeholder="Search for shoes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-lg font-body outline-none placeholder:text-muted-foreground"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4 font-body text-lg font-medium uppercase tracking-wide">
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/shoes" onClick={() => setMobileOpen(false)}>Shoes</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart</Link>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16 md:h-20" />
    </>
  );
}
