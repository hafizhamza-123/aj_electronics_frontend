import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiUser } from "react-icons/fi";
import API from "../../api/axios";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // ✅ Fetch only users with role = "user"
  const load = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Search filter
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="text-gray-600 text-center py-6">Loading users...</div>
    );

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-6">
      {/* 🔍 Top Bar - Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2 w-full md:w-64 shadow-sm">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filter Button (optional placeholder) */}
          <button className="flex items-center gap-1 text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition shadow-sm">
            <FiFilter className="text-gray-500" /> Filters
          </button>
        </div>
      </div>

      {/* 👥 Users Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {["#", "Avatar", "Name", "Email", "Joined"].map((col) => (
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
            {currentUsers.map((u, idx) => (
              <tr
                key={u._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                {/* Index */}
                <td className="px-5 py-3 text-gray-700 text-sm">
                  {indexOfFirstUser + idx + 1}
                </td>

                {/* Avatar */}
                <td className="px-5 py-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 shadow-sm">
                    <FiUser />
                  </div>
                </td>

                {/* Name */}
                <td className="px-5 py-3 text-gray-800 font-medium">
                  {u.name || "Unknown"}
                </td>

                {/* Email */}
                <td className="px-5 py-3 text-gray-700 text-sm">{u.email}</td>

                {/* Joined Date */}
                <td className="px-5 py-3 text-gray-600 text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {currentUsers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, idx) => {
              const page = idx + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    currentPage === page
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  } transition`}
                >
                  {page}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
