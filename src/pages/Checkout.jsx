import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Pakistan",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fixed shipping cost ($5)
  const shippingCost = 5;
  const total = subtotal + shippingCost;

  const states = [
    "Punjab",
    "Sindh",
    "KPK",
    "Balochistan",
    "Kashmir",
    "Gilgit Baltistan",
    "FATA",
  ];

  const handleChange = (e) => {
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // ✅ Stripe Checkout Integration
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      toast.error("Cart is empty");
      return;
    }

    if (!shipping.state) {
      toast.error("Please select your province/state");
      return;
    }

    setLoading(true);
    try {
      // Create Stripe Checkout Session
      const res = await API.post("/payment/create-checkout-session", {
        items: cartItems.map((i) => ({
          id: i.productId || i.id,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        })),
        shipping,
      });

      if (res.data?.url) {
        // ✅ Redirect to Stripe payment page
        window.location.href = res.data.url;
      } else {
        toast.error("Unable to redirect to payment");
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      toast.error(
        err?.response?.data?.error || "Failed to start Stripe checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-16 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column — Shipping Info */}
        <form
          className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-8"
          onSubmit={handlePlaceOrder}
        >
          {/* Shipping Info */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="firstName"
                value={shipping.firstName}
                required
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
              <input
                name="lastName"
                value={shipping.lastName}
                required
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <input
              name="email"
              type="email"
              value={shipping.email}
              required
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <input
              name="address"
              value={shipping.address}
              required
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 focus:ring-2 focus:ring-orange-500 outline-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <input
                name="city"
                value={shipping.city}
                required
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />

              <select
                name="state"
                value={shipping.state}
                required
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
              >
                <option value="">Select Province</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <input
                name="zip"
                value={shipping.zip}
                onChange={handleChange}
                placeholder="ZIP Code (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <input
              name="country"
              value={shipping.country}
              disabled
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-4 bg-gray-100 text-gray-600"
            />
          </section>

          {/* Stripe Button */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Payment Method
            </h2>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-3 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
            >
              {loading
                ? "Redirecting to Stripe..."
                : `Pay $${total.toFixed(2)} with Stripe`}
            </button>
          </section>
        </form>

        {/* Right Column — Order Summary */}
        <aside className="bg-white rounded-2xl shadow-md p-6 md:p-8 h-fit">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty 🛒</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId || item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-800">
                    ${Number(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="pt-4 space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Checkout;
