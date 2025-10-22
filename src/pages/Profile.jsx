import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import API from "../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          API.get("/users/profile"),
          API.get("/users/my-orders"),
        ]);
        setProfile(profileRes.data.user);
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error("Error fetching profile or orders:", error);
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-gray-500">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* 🔹 Left Card - User Info */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-5xl font-bold shadow-sm">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-center">
            {profile.name || "Unnamed User"}
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center">
            Welcome back to your account
          </p>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <FiMail className="text-orange-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <FiUser className="text-orange-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="text-gray-800 font-medium">
                  {profile.role || "User"}
                </p>
              </div>
            </div>

            {profile.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <FiPhone className="text-orange-500 text-xl" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-gray-800 font-medium">{profile.phone}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium shadow-md 
            hover:bg-orange-500 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>

        {/* 🔹 Right Section - Orders */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
            <FiPackage className="text-orange-500" />
            My Orders
          </h3>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">
              You haven't placed any orders yet.
            </p>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-100 bg-gray-50 rounded-xl p-5 hover:shadow-md transition-all duration-150"
                >
                  <div className="flex flex-wrap justify-between items-center mb-2">
                    <div>
                      <p className="text-gray-800 font-semibold">
                        Order #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="divide-y divide-gray-200 text-sm text-gray-700">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2"
                      >
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-right mt-2 font-semibold text-gray-800">
                    Total: ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
