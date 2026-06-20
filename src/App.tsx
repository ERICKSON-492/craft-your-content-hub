import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Products from "@/pages/Products";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/admin/Admin";
import AdminContent from "@/pages/admin/AdminContent";
import AdminServices from "@/pages/admin/AdminServices";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminProjects from "@/pages/admin/AdminProjects";
import AdminMessages from "@/pages/admin/AdminMessages";
import RequireAdmin from "@/components/RequireAdmin";

export default function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="projects" element={<Projects />} />
          <Route path="contact" element={<Contact />} />
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
          <Route path="messages" element={<AdminMessages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
