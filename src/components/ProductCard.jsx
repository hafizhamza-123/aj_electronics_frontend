// src/components/ProductCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product, onClick }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // ✅ Prevent triggering parent onClick
    e.preventDefault();  // ✅ Prevent link behavior if inside <Link>
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 flex flex-col h-full w-full cursor-pointer"
      onClick={onClick} // navigate to product details
    >
      {/* Image section */}
      <div className="h-44 w-full mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
        <img
          src={product?.image || "/assets/placeholder.jpg"}
          alt={product?.name || "Product"}
          className="object-contain h-full w-full"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-800 hover:text-orange-500 transition">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500">{product.brand}</p>
        </div>

        {/* Price & Button */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-bold">${product.price}</div>
            {product.discount && (
              <div className="text-xs text-green-600">
                {product.discount}% off
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-orange-500 text-white px-3 py-2 rounded-lg shadow hover:bg-orange-600 hover:scale-105 transform transition duration-150 w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
