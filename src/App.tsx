import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import RequireAdmin from "@/components/RequireAdmin";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Shop = lazy(() => import("@/pages/Shop"));
const Projects = lazy(() => import("@/pages/Projects"));
const Contact = lazy(() => import("@/pages/Contact"));
const Login = lazy(() => import("@/pages/Login"));
const Cart = lazy(() => import("@/pages/Cart"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const OrderConfirmation = lazy(() => import("@/pages/OrderConfirmation"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Admin = lazy(() => import("@/pages/admin/Admin"));
const AdminContent = lazy(() => import("@/pages/admin/AdminContent"));
const AdminServices = lazy(() => import("@/pages/admin/AdminServices"));
const AdminProducts = lazy(() => import("@/pages/admin/AdminProducts"));
const AdminProjects = lazy(() => import("@/pages/admin/AdminProjects"));
const AdminMessages = lazy(() => import("@/pages/admin/AdminMessages"));
const AdminOrders = lazy(() => import("@/pages/admin/AdminOrders"));

function PageLoader() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center text-sm text-muted-foreground">
      Loading page…
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster richColors position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="shop" element={<Shop />} />
              <Route path="products" element={<Navigate to="/shop" replace />} />
              <Route path="projects" element={<Projects />} />
              <Route path="contact" element={<Contact />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="login" element={<Login />} />
            </Route>
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <Admin />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminContent />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}
