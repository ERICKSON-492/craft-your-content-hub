import { Outlet, NavLink, Link } from "react-router-dom";
import { Phone, Mail, MapPin, LogIn, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/elite-logo.png.asset.json";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Products" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contacts" },
];

export default function Layout() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo.url} alt="Elite Stainless Steel Concepts" className="h-10 w-auto object-contain" />
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
            {user ? (
              <>
                {isAdmin && (
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin">
                      <ShieldCheck className="mr-1 h-4 w-4" /> Admin
                    </Link>
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link to="/login">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
            )}
            <Button asChild size="sm">
              <Link to="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-300">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo.url} alt="Elite Stainless" className="h-12 w-auto object-contain" />
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
