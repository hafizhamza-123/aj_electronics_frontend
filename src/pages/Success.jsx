import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const orderId = params.get("order_id");
  const { clearCart } = useCart();

  const [isVerified, setIsVerified] = useState(false);
  const hasVerified = useRef(false); // prevents multiple verifications

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Prevent duplicate runs (even in React Strict Mode)
        if (hasVerified.current || !sessionId) return;
        hasVerified.current = true;

        const res = await API.post("/payment/verify-session", { sessionId, orderId });

        if (res.data.success) {
          setIsVerified(true);
          toast.success("Payment verified successfully 🎉", { id: "payment-success" });
          clearCart();
          console.log("✅ Order saved:", res.data.order);
        } else {
          toast.error(res.data.message || "Payment verification failed", { id: "payment-fail" });
        }
      } catch (err) {
        console.error("❌ Payment verification error:", err);
        toast.error("Server error verifying payment", { id: "server-error" });
      }
    };

    verifyPayment();
  }, [sessionId, orderId, clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="text-green-500 w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          {isVerified ? "Payment Successful 🎉" : "Verifying Payment..."}
        </h1>
        <p className="text-gray-600 mb-6">
          {isVerified
            ? "Thank you for your purchase! Your order has been successfully placed and will be processed shortly."
            : "Please wait while we confirm your payment."}
        </p>
        {isVerified && (
          <Link
            to="/"
            className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Continue Shopping
          </Link>
        )}
      </div>
    </div>
  );
}
