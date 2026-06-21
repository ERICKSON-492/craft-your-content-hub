import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { Phone, Mail, MapPin, ShieldCheck, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/elite-logo.png";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contacts" },
];

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
            <img src={logo} alt="Elite Stainless Steel Concepts" className="h-10 w-auto object-contain" />
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">ELITE STAINLESS</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `transition-colors hover:text-primary ${
                    isActive ? "text-primary font-medium" : "text-muted-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="tel:+254794872338" className="hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" />
              +254 794 872 338
            </a>
            {user && isAdmin && (
              <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
                <Link to="/admin">
                  <ShieldCheck className="mr-1 h-4 w-4" /> Admin
                </Link>
              </Button>
            )}
            {user && (
              <Button size="sm" variant="ghost" onClick={() => signOut()} className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
            <Button asChild size="sm" className="hidden sm:inline-flex">
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
                {user && (
                  <Button size="sm" variant="ghost" onClick={() => { signOut(); setOpen(false); }}>
                    <LogOut className="mr-1 h-4 w-4" /> Sign out
                  </Button>
                )}
                <a href="tel:+254794872338" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" /> +254 794 872 338
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>


      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              {/* Cleaned: src={logo} instead of logo.url */}
              <img src={logo} alt="Elite Stainless" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Premium stainless steel fabrication for commercial kitchens, refrigeration
              systems, laundry facilities, and architectural structures across Kenya.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Services</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary">Kitchen Fabrications</Link></li>
              <li><Link to="/products" className="hover:text-primary">Refrigeration</Link></li>
              <li><Link to="/products" className="hover:text-primary">Laundry</Link></li>
              <li><Link to="/products" className="hover:text-primary">Structural Railings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Request Quotation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /><span>+254 794 872 338<br />+254 706 093 060</span></li>
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /><span>sales@elitestainlesssteelconcepts.co.ke</span></li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /><span>Landies Road, Nairobi, Kenya</span></li>
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
    </div>
  );
}
