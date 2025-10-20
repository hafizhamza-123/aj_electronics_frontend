import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/category/${categoryName}`);
        setProducts(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching category products:", err);
        setError("No products found in this category");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low-high") return a.price - b.price;
    if (sort === "high-low") return b.price - a.price;
    if (sort === "alpha") return a.name.localeCompare(b.name);
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500 text-lg">
        Loading {categoryName} products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-gray-500 text-lg">
        <p>{error}</p>
        <Link
          to="/shop"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-16">
      {/* 🔹 Breadcrumb & Header */}
      <div className="bg-gray-50 rounded-xl shadow-sm p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border border-gray-100">
        <div>
          <nav className="text-sm text-gray-500 mb-1">
            <Link to="/" className="hover:text-orange-500 transition">
              Home
            </Link>{" "}
            /{" "}
            <span className="text-gray-700 capitalize font-medium">
              {categoryName}
            </span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 capitalize tracking-wide">
            {categoryName}
          </h1>
        </div>

        {/* 🔹 Filter Section */}
        <div className="mt-4 sm:mt-0 bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-gray-700 text-sm outline-none focus:ring-0"
          >
            <option value="">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="alpha">Alphabetical</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* 🔹 Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => handleProductClick(product._id)}
          />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
