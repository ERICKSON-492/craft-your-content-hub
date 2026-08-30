import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/elite-logo.png";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/shop", label: "Shop" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contacts" },
];

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="animate-site-header-in sticky top-0 z-40 border-b border-border/70 bg-background/95 shadow-[0_1px_0_rgba(16,42,67,0.03)] backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to="/"
            className="group flex items-center gap-3 shrink-0"
            onClick={() => setOpen(false)}
          >
            <img
              src={logo}
              alt="Elite Stainless Steel Concepts"
              className="animate-logo-in h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-[0.7rem] font-bold tracking-[0.18em] text-foreground">
                ELITE STAINLESS
              </span>
              <span className="mt-0.5 text-[0.58rem] font-medium tracking-[0.16em] text-muted-foreground">
                CONCEPTS · NAIROBI
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `relative py-2 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:rounded-full after:bg-primary after:transition-transform after:duration-200 hover:text-primary ${
                    isActive
                      ? "font-semibold text-primary after:scale-x-100"
                      : "text-muted-foreground after:scale-x-0"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+254718927217"
              className="hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Phone className="h-4 w-4 text-primary" />
              0718 927 217
            </a>
            {user && isAdmin && (
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link to="/admin">
                  <ShieldCheck className="mr-1 h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
            {!user && (
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link to="/login">Login</Link>
              </Button>
            )}
            {user && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut()}
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <Button asChild size="sm" className="animate-light-sweep hidden sm:inline-flex">
              <Link to="/contact">Get a Quote</Link>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 text-sm border-b border-border/60 last:border-0 ${
                      isActive ? "text-primary font-medium" : "text-foreground"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <Button asChild size="sm" onClick={() => setOpen(false)}>
                  <Link to="/contact">Get a Quote</Link>
                </Button>
                {user && isAdmin && (
                  <Button asChild size="sm" variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/admin">
                      <ShieldCheck className="mr-1 h-4 w-4" /> Admin
                    </Link>
                  </Button>
                )}
                {!user && (
                  <Button asChild size="sm" variant="outline" onClick={() => setOpen(false)}>
                    <Link to="/login">Login</Link>
                  </Button>
                )}
                {user && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-1 h-4 w-4" /> Sign out
                  </Button>
                )}
                <a
                  href="tel:+254718927217"
                  className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Phone className="h-4 w-4 text-primary" /> 0718 927 217
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#102a43] text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              {/* Cleaned: src={logo} instead of logo.url */}
              <img
                src={logo}
                alt="Elite Stainless Steel Concepts"
                className="animate-logo-in h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-300/75">
              Premium stainless steel fabrication for commercial kitchens, refrigeration systems,
              laundry facilities, and architectural structures across Kenya.
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-white/90">Services</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300/75">
              <li>
                <Link to="/products" className="hover:text-primary">
                  Kitchen Fabrications
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary">
                  Refrigeration
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary">
                  Laundry
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary">
                  Structural Railings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-white/90">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Request Quotation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-white/90">Contact</h4>
            <ul className="mt-5 space-y-4 text-sm text-slate-300/75">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <span>
                  0718 927 217
                  <br />
                  0712 213 969
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <span>elitestainlesssteelconcepts@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>Landies Road, Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Elite Stainless Steel Concepts. All rights reserved.</p>
            <p>Privacy Policy • Terms of Service</p>
          </div>
        </div>
      </footer>

      <a
        href="https://wa.me/254718927217?text=Hello%20Elite%20Stainless%20Steel%20Concepts%2C%20I%27d%20like%20to%20discuss%20a%20fabrication%20project."
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Elite Stainless Steel Concepts on WhatsApp"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1fa855] text-white shadow-[0_12px_28px_rgba(31,168,85,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#188f48] hover:shadow-[0_16px_32px_rgba(31,168,85,0.38)] focus-visible:outline-white sm:bottom-7 sm:right-7"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
