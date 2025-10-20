import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiFilter, FiSearch } from "react-icons/fi";
import API from "../../api/axios";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const load = async () => {
    try {
      const res = await API.get("/admin/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await API.delete(`/admin/products/${id}`);
    load();
  };

  const getProductImage = (p) => {
    return p.mainImage || p.image || (p.images && p.images[0]) || "";
  };

  // Filtered products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] py-6">
      {/* Top Bar - Filter + Add Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Filter & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center border border-gray-300 rounded-lg bg-white px-3 py-2 w-full md:w-64 shadow-sm">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
              className="outline-none w-full text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          <button className="flex items-center gap-1 text-gray-600 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-100 transition shadow-sm">
            <FiFilter className="text-gray-500" /> Filters
          </button>
        </div>

        {/* Add Product Button */}
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200 self-end md:self-auto"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {["#", "Image", "Name", "Price", "Stock", "Actions"].map((col) => (
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
            {paginatedProducts.map((p, idx) => {
              const image = getProductImage(p);
              const globalIndex = startIndex + idx + 1;

              return (
                <tr
                  key={p._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-5 py-3 text-gray-700 text-sm">
                    {globalIndex}
                  </td>

                  {/* Product Image */}
                  <td className="px-5 py-3">
                    {image ? (
                      <img
                        src={image}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                        N/A
                      </div>
                    )}
                  </td>

                  {/* Product Name */}
                  <td className="px-5 py-3 text-gray-800 font-medium">
                    {p.name}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-3 text-gray-700 font-semibold">
                    ${p.price}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-3">
                    {p.stock > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {p.stock}
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="flex items-center gap-1 text-gray-700 hover:text-gray-900 transition"
                      >
                        <FiEdit2 className="text-sm" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
                      >
                        <FiTrash2 className="text-sm" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedProducts.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No products found.
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
