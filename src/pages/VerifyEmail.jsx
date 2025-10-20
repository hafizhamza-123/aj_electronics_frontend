import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import API from "../api/axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 4000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed.");
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center border border-gray-100 relative overflow-hidden">
        {/* Animated background accent */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10"></div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          {status === "loading" && (
            <Loader2 className="animate-spin text-blue-600 w-14 h-14" />
          )}
          {status === "success" && (
            <CheckCircle className="text-green-500 w-14 h-14 animate-scaleIn" />
          )}
          {status === "error" && (
            <XCircle className="text-red-500 w-14 h-14 animate-scaleIn" />
          )}
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-semibold mb-3 text-gray-900">
          {status === "loading"
            ? "Verifying..."
            : status === "success"
            ? "Email Verified!"
            : "Verification Failed"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          {message}
        </p>

        {/* Redirect Notice */}
        {status === "success" && (
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        )}

        {/* Retry Button */}
        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
