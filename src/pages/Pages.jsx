// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          API.get("/user/profile"),
          API.get("/user/orders"),
        ]);
        setUser(userRes.data);
        setOrders(orderRes.data);
      } catch (err) {
        console.error("Error fetching profile or orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-gray-600 w-8 h-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        Unable to load profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6 mb-10 border"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="font-semibold">Name:</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="font-semibold">Verified:</p>
              <p>
                {user.verified ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-red-600 font-medium">No</span>
                )}
              </p>
            </div>
            <div>
              <p className="font-semibold">Joined:</p>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-md rounded-2xl p-6 border"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            My Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-600">You haven’t placed any orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-xl p-4 hover:shadow-md transition bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">
                    Total: ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
