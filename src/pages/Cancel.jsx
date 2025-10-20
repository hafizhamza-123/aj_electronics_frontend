import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function Cancel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 max-w-md text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="text-red-500 w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Canceled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was canceled. No charges were made to your account.
          You can try again or continue browsing our store.
        </p>
        <div className="flex justify-center space-x-3">
          <Link
            to="/cart"
            className="bg-gray-200 text-gray-700 px-5 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Return to Cart
          </Link>
          <Link
            to="/"
            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-5 py-3 rounded-lg shadow-md hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
