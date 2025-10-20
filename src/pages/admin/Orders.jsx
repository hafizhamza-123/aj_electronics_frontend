// src/pages/admin/Orders.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FiFilter, FiSearch } from "react-icons/fi";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Error loading orders:", err);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const order = orders.find((o) => o._id === orderId);
    if (order.status === "Delivered") {
      toast.error("Delivered orders cannot be modified!");
      return;
    }

    setUpdating(orderId);
    try {
      const res = await API.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(res.data.message || "Order status updated!");
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err);
      toast.error(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (loading)
    return (
      <div className="text-gray-600 text-center py-6 animate-pulse">
        Loading orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-6">
      {/* Top Bar - Filter + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2 w-full md:w-64 shadow-sm">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset to first page when searching
              }}
              className="outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          <button className="flex items-center gap-1 text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition shadow-sm">
            <FiFilter className="text-gray-500" /> Filters
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {["#", "User", "Total", "Status", "Date"].map((col) => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedOrders.map((o, idx) => (
              <tr
                key={o._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-5 py-3 text-gray-700 text-sm">
                  {startIndex + idx + 1}
                </td>
                <td className="px-5 py-3 text-gray-800 font-medium">
                  {o.user?.name || o.user?.email || "-"}
                </td>
                <td className="px-5 py-3 text-gray-700 font-semibold">
                  ${o.total}
                </td>

                {/* Status Dropdown */}
                <td className="px-5 py-3 text-sm">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    disabled={updating === o._id || o.status === "Delivered"}
                    className={`rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 cursor-pointer ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700 border-green-400"
                        : o.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                        : o.status === "Processing"
                        ? "bg-blue-100 text-blue-700 border-blue-400"
                        : o.status === "Shipped"
                        ? "bg-purple-100 text-purple-700 border-purple-400"
                        : "bg-gray-100 text-gray-700 border-gray-400"
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                <td className="px-5 py-3 text-gray-700 text-sm">
                  {new Date(o.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {paginatedOrders.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm font-medium transition ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm text-sm font-medium transition ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
