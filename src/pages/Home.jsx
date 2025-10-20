import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import TopSellers from "../components/TopSellers";
import Categories from "../components/Categories";
import ProductCard from "../components/ProductCard";
import Features from "../components/Features";
import toast from "react-hot-toast";
import API from "../api/axios"; 

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      
        const res = await API.get("/products");

        if (res.status === 200) {
          setProducts(res.data);
        } else {
          toast.error(res.data.message || "Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("Server error while fetching products");
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      <Hero />
      <Categories />
      <TopSellers />
      <Features />

      {/* Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Popular Products</h3>
          <a
            href="/shop"
            className="text-sm text-gray-600 hover:text-orange-500"
          >
            Show More →
          </a>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500 text-center">No products available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {products.slice(0, 8).map((p) => (
              <ProductCard
                key={p._id}
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
                onClick={() => handleProductClick(p._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
