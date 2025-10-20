// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiSettings,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const navItems = [
    { to: "/admin/dashboard", icon: <FiHome />, label: "Dashboard" },
    { to: "/admin/products", icon: <FiBox />, label: "Products" },
    { to: "/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
    { to: "/admin/users", icon: <FiUsers />, label: "Customers" },
  ];

  useEffect(() => {
    const current = navItems.find((item) => location.pathname.startsWith(item.to));
    setPageTitle(current ? current.label : "Dashboard");
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#f3f4f6] text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="py-8 px-6 flex items-center gap-2 border-b">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Aljadeed</span>
            <span className="text-orange-500">Electronics</span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 text-[15px] font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-orange-100 text-orange-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-5 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium
      text-white bg-gray-900 rounded-lg cursor-pointer
      hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>

      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto p-6">
        {/* Header */}
        <header className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-6 py-4 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-gray-700 text-2xl"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-3 py-2 text-sm border rounded-xl w-60 focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>
            <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Dynamic Outlet */}
        <Outlet />
      </main>
    </div>
  );
}
