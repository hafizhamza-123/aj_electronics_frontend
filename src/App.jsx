import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import VerifyEmail from "./pages/VerifyEmail";
import RequestResetPassword from "./pages/RequestReset";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import CategoryPage from "./pages/CategoryPage";
import { Toaster } from "react-hot-toast";
import ScrollToTopButton from "./components/ScrollToTopButton"; // ✅ Added

// === Layout Wrapper (hide Navbar/Footer on admin pages)
function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* ========= Public Routes ========= */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <PublicRoute>
                <Shop />
              </PublicRoute>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <PublicRoute>
                <CategoryPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PublicRoute>
                <ProductPage />
              </PublicRoute>
            }
          />

          {/* ========= Auth Related ========= */}
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/request-reset" element={<RequestResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ========= Protected User Routes ========= */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ========= Stripe Result Pages ========= */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* ========= Admin Routes ========= */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </LayoutWrapper>

      {/*  Floating Scroll-To-Top Button */}
      <ScrollToTopButton />

      {/*  Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#f9fafb",
            borderRadius: "10px",
            padding: "12px 20px",
            fontSize: "0.95rem",
            border: "1px solid #f97316",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            animation: "slideDownFade 0.4s ease forwards",
          },
          success: {
            iconTheme: { primary: "#f97316", secondary: "#111827" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#111827" },
            style: { border: "1px solid #ef4444" },
          },
        }}
      />

      <style>
        {`
@keyframes slideDownFade {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  60% {
    transform: translateY(6px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
`}
      </style>
    </Router>
  );
}

export default App;
