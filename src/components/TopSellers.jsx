import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function TopSellers() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/top`);
        const data = await res.json();

        if (res.ok) {
          setTopProducts(data);
        } else {
          toast.error(data.message || "Failed to load top-selling products");
        }
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
        toast.error("Server error while fetching top-selling products");
      }
    };

    fetchTopSellers();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Top-Selling Products</h3>
        <Link
          to="/shop"
          className="text-sm text-gray-600 hover:text-orange-500"
        >
          Show More →
        </Link>
      </div>

      {topProducts.length === 0 ? (
        <p className="text-gray-500 text-center">No top-selling products yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topProducts.map((p) => (
            <Link to={`/product/${p._id}`} key={p._id}>
              <ProductCard
                product={{
                  id: p._id,
                  name: p.name,
                  brand: p.brand,
                  category: p.category,
                  price: p.price,
                  discount: p.discount,
                  image: p.image,
                  stock: p.stock,
                  topSeller: p.topSeller,
                }}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
