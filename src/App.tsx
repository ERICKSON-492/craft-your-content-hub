import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Shop from "@/pages/Shop";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/admin/Admin";
import AdminContent from "@/pages/admin/AdminContent";
import AdminServices from "@/pages/admin/AdminServices";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminMessages from "@/pages/admin/AdminMessages";
import AdminOrders from "@/pages/admin/AdminOrders";
import RequireAdmin from "@/components/RequireAdmin";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster richColors position="top-right" />
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
      </CartProvider>
    </AuthProvider>
  );
}
