import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (res.status === 200) {
          const data = res.data;
          setProduct(data);
          setMainImage(data.image || "");
        } else {
          toast.error("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products based on category
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        const res = await API.get(`/products`);
        const relatedItems = res.data
          .filter(
            (p) => p.category === product.category && p._id !== product._id
          )
          .slice(0, 4); // limit to 4 products
        setRelated(relatedItems);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };
    fetchRelated();
  }, [product]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-gray-700">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      toast.success(`${product.name} (x${quantity}) added to cart!`);
    } else {
      toast.error("This product is out of stock!");
    }
  };

  const handleBuyNow = () => {
    if (product.stock > 0) {
      addToCart(product, quantity);
      navigate("/checkout");
    } else {
      toast.error("This product is out of stock!");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10 pt-16">
      {/* Breadcrumb */}
      <nav className="text-sm mb-6 text-gray-500">
        <Link to="/" className="hover:text-orange-500">Home</Link> &gt;{" "}
        <Link to="/shop" className="hover:text-orange-500">Shop</Link> &gt;{" "}
        <span className="text-gray-700">{product.name}</span>
      </nav>

      {/* Product Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images Section */}
        <div className="flex flex-col">
          <div className="relative">
            {product.topSeller && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 text-xs rounded-full shadow">
                🔥 Top Seller
              </span>
            )}
            {product.discount && (
              <span className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 text-xs rounded-full shadow">
                -{product.discount}%
              </span>
            )}
            <img
              src={mainImage}
              alt={product.name}
              className="rounded-lg shadow-md object-contain w-full max-h-[500px] bg-white"
            />
          </div>

          {/* Thumbnails */}
          {product.images?.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {[product.image, ...product.images].map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 p-1 rounded border transition cursor-pointer ${mainImage === img
                    ? "border-orange-500"
                    : "border-gray-300 hover:border-orange-400"
                    }`}
                >
                  <img
                    src={img}
                    alt={`thumb-${i}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.category}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-orange-500">
              ${product.price}
            </span>
            {product.discount > 0 && (
              <span className="text-gray-500 line-through">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <p
            className={`mt-2 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
          >
            {product.stock > 0
              ? `✅ In Stock (${product.stock} available)`
              : "❌ Out of Stock"}
          </p>

          <p className="mt-6 text-gray-700 leading-relaxed">
            {product.description || "No description provided."}
          </p>

          {/* Quantity + Buttons */}
          <div className="mt-6 flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden shadow-sm w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition text-lg font-bold cursor-pointer"
                >
                  −
                </button>
                <div className="px-6 py-2 font-medium">{quantity}</div>
                <button
                  onClick={() =>
                    setQuantity((q) => (q < product.stock ? q + 1 : q))
                  }
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition text-lg font-bold cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow 
                           hover:bg-orange-600 hover:scale-[1.03] transition cursor-pointer 
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                🛒 Add to Cart
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="w-full px-8 py-3 bg-black text-white font-semibold rounded-lg shadow 
                         hover:bg-gray-800 hover:scale-[1.03] transition cursor-pointer 
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Details */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">Product Details</h3>
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              <ul className="list-disc ml-6 text-gray-600">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <li key={k}>
                    {k}: {v}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {related.length > 0 && (
        <div className="mt-16 bg-gray-50 py-12 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            You May Also Like
          </h2>

          {/* Desktop Scrollable Row */}
          <div className="hidden md:flex gap-6 overflow-x-auto px-8 scrollbar-hide pb-4">
            {related.map((item) => (
              <div
                key={item._id}
                className="flex-shrink-0 w-[240px] hover:scale-105 transition-all duration-300"
                style={{ minHeight: "320px" }} // ✅ reduced height
              >
                <ProductCard
                  product={item}
                  onClick={() => navigate(`/product/${item._id}`)}
                />
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="relative md:hidden flex items-center justify-center px-4">
            {related.length > 2 && (
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 2 + related.length) % related.length)
                }
                className="absolute left-2 z-10 bg-white border border-gray-300 text-black 
              rounded-full p-3 shadow-sm hover:bg-black hover:text-white 
              transition-all duration-300 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div className="flex overflow-hidden w-full justify-center items-stretch">
              {related.slice(currentIndex, currentIndex + 2).map((item) => (
                <div
                  key={item._id}
                  className="flex-shrink-0 w-1/2 p-3 hover:scale-105 transition-all duration-300"
                >
                  <div style={{ minHeight: "320px" }}>
                    <ProductCard
                      product={item}
                      onClick={() => navigate(`/product/${item._id}`)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {related.length > 2 && (
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 2) % related.length)}
                className="absolute right-2 z-10 bg-white border border-gray-300 text-black 
              rounded-full p-3 shadow-sm hover:bg-black hover:text-white 
              transition-all duration-300 active:scale-95"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}



    </section>
  );
}
