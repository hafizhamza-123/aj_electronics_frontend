import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const shippingFee = 5.0; // Flat shipping fee

  const isEmpty = cartItems.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-14">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-all shadow-md active:scale-95"
              >
                Back to Shop
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.productId || `${item.name}-${index}`}
                className="flex items-center justify-between bg-white shadow-sm rounded-lg p-3 hover:shadow-md transition-all"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-medium text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.brand}</p>
                    <p className="text-sm font-semibold mt-1 text-orange-600">
                      ${item.price}
                    </p>
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border rounded-md text-sm">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
                    >
                      -
                    </button>
                    <span className="px-3">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {!isEmpty && (
          <aside className="w-full lg:w-80 bg-white shadow rounded-lg p-6 h-fit mt-4 lg:mt-0 border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>

            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Shipping</span>
              <span className="text-gray-600">${shippingFee.toFixed(2)}</span>
            </div>

            <hr className="my-4 border-gray-200" />

            <div className="flex justify-between font-semibold text-lg mb-6 text-gray-800">
              <span>Total</span>
              <span>${(subtotal + shippingFee).toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-orange-500 text-white py-3 rounded-lg shadow hover:bg-orange-600 active:scale-95 transition transform cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}
