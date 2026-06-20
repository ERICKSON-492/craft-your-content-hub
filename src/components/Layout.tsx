import { Outlet, NavLink, Link } from "react-router-dom";
import { Phone, LogIn, ShieldCheck, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
              ES
            </span>
            <span className="hidden sm:inline">ELITE STAINLESS</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="tel:+254794872338"
              className="hidden lg:inline-flex items-center gap-2 text-sm text-muted-foreground"
            >
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
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3 text-sm">
          <div>
            <div className="font-bold tracking-tight">ELITE STAINLESS</div>
            <p className="mt-2 text-muted-foreground max-w-xs">
              Commercial stainless steel fabrication, Nairobi — since 2014.
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">Visit</div>
            <p className="text-muted-foreground">Landies Road, Nairobi, Kenya</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <p className="text-muted-foreground">+254 794 872 338</p>
            <p className="text-muted-foreground">sales@elitestainlesssteelconcepts.co.ke</p>
          </div>
        </div>
        <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Elite Stainless Steel Concepts
        </div>
      </footer>
    </div>
  );
}
