import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FiUsers, FiShoppingBag, FiBox } from "react-icons/fi";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats + revenue
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [uRes, oRes, pRes, revRes] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/orders"),
          API.get("/admin/products"),
          API.get("/admin/revenue-stats"),
        ]);

        setStats({
          users: uRes.data.users?.length || 0,
          orders: oRes.data.orders?.length || 0,
          products: pRes.data.products?.length || 0,
        });

        setRevenueData(revRes.data.data || []);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 font-medium">
        Loading dashboard...
      </div>
    );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-4">
      <div className="max-w-7xl mx-auto px-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FiUsers className="text-blue-500 text-3xl" />}
            title="Total Customers"
            value={stats.users}
            gradient="from-blue-500/10 to-blue-500/5"
          />
          <StatCard
            icon={<FiShoppingBag className="text-green-500 text-3xl" />}
            title="Total Orders"
            value={stats.orders}
            gradient="from-green-500/10 to-green-500/5"
          />
          <StatCard
            icon={<FiBox className="text-orange-500 text-3xl" />}
            title="Total Products"
            value={stats.products}
            gradient="from-orange-500/10 to-orange-500/5"
          />
        </div>

        {/* Chart & Customers Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-gray-800 font-semibold text-lg">
                Revenue (Last 6 Months)
              </h2>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
                Paid Orders
              </span>
            </div>

            {revenueData.length === 0 ? (
              <div className="flex justify-center items-center h-56 text-gray-400">
                No revenue data available
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis
                      tick={{ fill: "#6b7280" }}
                      tickFormatter={(v) => `$${v.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        border: "1px solid #e5e7eb",
                        color: "#374151",
                      }}
                    />
                    <defs>
                      <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#f97316" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <Bar
                      dataKey="revenue"
                      fill="url(#orangeGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Customers Progress */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <h2 className="text-gray-800 font-semibold mb-4 text-lg">
              Customer Insights
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Progress label="Current" value={82} color="orange" />
              <Progress label="New" value={68} color="amber" />
              <Progress label="Returning" value={52} color="green" />
              <Progress label="Inactive" value={31} color="red" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Stat Card Component */
function StatCard({ icon, title, value, gradient }) {
  return (
    <div
      className={`flex items-center gap-4 bg-gradient-to-br ${gradient} from-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300`}
    >
      <div className="p-4 bg-white shadow-sm rounded-xl">{icon}</div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* Animated Progress Circle Component (No rotation on text) */
function Progress({ label, value, color }) {
  const [progress, setProgress] = useState(0);
  const colors = {
    orange: "text-orange-500 stroke-orange-500",
    amber: "text-amber-500 stroke-amber-500",
    green: "text-green-500 stroke-green-500",
    red: "text-red-500 stroke-red-500",
  };

  // Animate circle fill
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const stepTime = 15;
    const step = (end / duration) * stepTime;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setProgress(Math.floor(start));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <svg className="w-16 h-16">
          <circle
            className="text-gray-200"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r="24"
            cx="32"
            cy="32"
          />
          <circle
            className={`${colors[color]} transition-all duration-300`}
            strokeWidth="6"
            strokeDasharray="150"
            strokeDashoffset={150 - (progress / 100) * 150}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="24"
            cx="32"
            cy="32"
            style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
          {progress}%
        </span>
      </div>
      <p className="mt-2 text-gray-600 text-sm font-medium">{label}</p>
    </div>
  );
}
