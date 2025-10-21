import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 🔍 Search MongoDB products
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products/search?q=${encodeURIComponent(
            searchQuery
          )}`
        );
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid JSON response");
        }
        const data = await res.json();
        if (res.ok) setResults(data);
        else toast.error(data.message || "Search failed");
      } catch (err) {
        console.error("Error fetching search results:", err);
        toast.error("Error fetching search results");
      }
    };
    const debounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleResultClick = (id) => {
    setSearchQuery("");
    setResults([]);
    setOpen(false);
    navigate(`/product/${id}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinkClass = (path) =>
    `relative transition duration-200 ${
      location.pathname === path
        ? "text-orange-500 font-semibold"
        : "text-gray-700"
    } hover:text-orange-500 
    after:content-[''] after:absolute after:-bottom-1 after:left-0 
    after:w-0 after:h-[2px] after:bg-orange-500 
    hover:after:w-full after:transition-all after:duration-300`;

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ============ Desktop Navbar ============ */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Aljadeed<span className="text-orange-500">Electronics</span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-8 text-sm">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/shop" className={navLinkClass("/shop")}>
              Shop
            </Link>
            {user && (
              <Link to="/profile" className={navLinkClass("/profile")}>
                Profile
              </Link>
            )}
            {!user && (
              <>
                <Link to="/login" className={navLinkClass("/login")}>
                  Login
                </Link>
                <Link to="/register" className={navLinkClass("/register")}>
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-4 relative">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 relative w-64">
              <FiSearch className="text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none ml-2 w-full"
                placeholder="Search cameras, lenses..."
              />

              {results.length > 0 && (
                <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleResultClick(item._id)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {user && (
              <Link to="/profile">
                <FiUser className="text-2xl text-gray-700 hover:text-orange-500 transition" />
              </Link>
            )}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-orange-500 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ============ Mobile Navbar ============ */}
        <div className="md:hidden flex items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            Aljadeed<span className="text-orange-500">Electronics</span>
          </Link>

          {/* Icons + Toggle */}
          <div className="flex items-center gap-3">
            {user && (
              <Link to="/profile">
                <FiUser className="text-2xl text-gray-700 hover:text-orange-500" />
              </Link>
            )}
            <Link to="/cart" className="relative">
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-orange-500" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <FiX className="text-2xl text-gray-700" />
              ) : (
                <FiMenu className="text-2xl text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {open && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/90 backdrop-blur-lg shadow-md z-50 border-t">
            <div className="flex flex-col px-4 py-3">
              {/* Search bar */}
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-3 relative">
                <FiSearch className="text-gray-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none ml-2 w-full text-sm"
                  placeholder="Search..."
                />
                {results.length > 0 && (
                  <div className="absolute top-12 left-0 w-full bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-y-auto">
                    {results.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleResultClick(item._id)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${item.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="py-2 text-gray-700 hover:text-orange-500"
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="py-2 text-gray-700 hover:text-orange-500"
              >
                Shop
              </Link>
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="py-2 text-gray-700 hover:text-orange-500"
                >
                  Profile
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-left py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="py-2 text-gray-700 hover:text-orange-500"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="py-2 text-gray-700 hover:text-orange-500"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
