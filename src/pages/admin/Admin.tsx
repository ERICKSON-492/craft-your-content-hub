import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Wrench, ShoppingBag, Hammer, Mail, ArrowLeft, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/admin", label: "Site content", icon: LayoutDashboard, end: true },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/products", label: "Shop", icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/projects", label: "Projects", icon: Hammer },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export default function Admin() {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Site</Link>
            </Button>
            <span className="font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button size="sm" variant="outline" onClick={() => signOut()}>Sign out</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`
                }
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="rounded-xl border border-border bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
