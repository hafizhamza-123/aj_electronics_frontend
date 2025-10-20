// src/pages/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Tab } from "@headlessui/react";
import { PlusCircle, Trash2, Upload } from "lucide-react";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discount: 0,
    stock: 0,
    description: "",
    topSeller: false,
    image: "",
    images: [],
    specifications: {},
  });

  const [uploading, setUploading] = useState(false);
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const categories = [
    "Cameras",
    "Lenses",
    "Drones",
    "Lighting",
    "Audio",
    "Accessories",
  ];

  useEffect(() => {
    if (id) {
      API.get(`/admin/products/${id}`)
        .then((res) => {
          if (res.data?.product) {
            setForm({
              ...res.data.product,
              specifications: res.data.product.specifications || {},
              images: res.data.product.images || [],
            });
          }
        })
        .catch(() => toast.error("Failed to load product"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSpecChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const addSpecification = () => {
    if (!newSpec.key || !newSpec.value)
      return toast.error("Both key and value required");
    setForm((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [newSpec.key]: newSpec.value },
    }));
    setNewSpec({ key: "", value: "" });
  };

  const removeSpec = (key) => {
    const updated = { ...form.specifications };
    delete updated[key];
    setForm((prev) => ({ ...prev, specifications: updated }));
  };

  const removeMainImage = () => setForm((prev) => ({ ...prev, image: "" }));
  const removeGalleryImage = (index) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  const handleImageUpload = async (e, multiple = false) => {
    const files = multiple ? e.target.files : [e.target.files[0]];
    if (!files.length) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=925528f18f235587e2877e24f95f8590`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (data?.data?.url) uploadedUrls.push(data.data.url);
        else toast.error("Failed to get ImgBB URL");
      } catch (err) {
        toast.error("Image upload failed");
      }
    }

    setForm((prev) => ({
      ...prev,
      ...(multiple
        ? { images: [...prev.images, ...uploadedUrls] }
        : { image: uploadedUrls[0] }),
    }));

    setUploading(false);
    toast.success("Image uploaded!");
  };

  // ✅ Description and specifications optional
  const isFormValid =
    form.name &&
    form.brand &&
    form.category &&
    form.price > 0 &&
    form.stock >= 0 &&
    form.image;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return toast.error("Please fill all required fields!");

    try {
      if (id) {
        await API.put(`/admin/products/${id}`, form);
        toast.success("Product updated successfully!");
      } else {
        await API.post("/admin/products", form);
        toast.success("Product created successfully!");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error("Failed to save product");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {id ? "Edit Product" : "Create Product"}
        </h1>
        <button
          onClick={() => navigate("/admin/products")}
          className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex gap-3 border-b border-gray-200 mb-6">
            {["Basic Info", "Media", "Pricing", "Inventory", "Specifications"].map(
              (tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    `px-4 py-2 text-sm font-medium rounded-t-md transition ${
                      selected
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {tab}
                </Tab>
              )
            )}
          </Tab.List>

          <Tab.Panels>
            {/* Basic Info */}
            <Tab.Panel className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Product Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded-md p-2"
                  />
                </div>
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Brand
                  </label>
                  <input
                    name="brand"
                    value={form.brand}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded-md p-2"
                  />
                </div>
                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded-md p-2 bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Top Seller Toggle */}
                <div className="flex items-center gap-2 mt-6">
                  <div
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        topSeller: !prev.topSeller,
                      }))
                    }
                    className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition ${
                      form.topSeller ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition ${
                        form.topSeller ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Top Seller
                  </span>
                </div>
              </div>

              {/* Description (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
            </Tab.Panel>

            {/* Media */}
            <Tab.Panel className="space-y-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Main Image
                </label>
                <div className="mt-2 flex items-center gap-4">
                  {form.image && (
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Main"
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={removeMainImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-100">
                    <Upload size={18} className="text-orange-500" />
                    <span className="text-sm text-gray-700">Upload</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, false)}
                    />
                  </label>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gallery Images
                </label>
                <label className="flex items-center gap-2 px-4 py-2 border rounded cursor-pointer hover:bg-gray-100 mt-2 w-fit">
                  <Upload size={18} className="text-orange-500" />
                  <span className="text-sm text-gray-700">Upload Gallery</span>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, true)}
                  />
                </label>
                <div className="mt-3 flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt="gallery"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            {/* Pricing */}
            <Tab.Panel className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
            </Tab.Panel>

            {/* Inventory */}
            <Tab.Panel>
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border rounded-md p-2"
                />
              </div>
            </Tab.Panel>

            {/* Specifications */}
            <Tab.Panel>
              <div className="space-y-4">
                {Object.keys(form.specifications).map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 border p-2 rounded-md"
                  >
                    <input
                      value={key}
                      readOnly
                      className="w-1/3 border rounded-md p-2 bg-gray-50"
                    />
                    <input
                      value={form.specifications[key]}
                      onChange={(e) =>
                        handleSpecChange(key, e.target.value)
                      }
                      className="flex-1 border rounded-md p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div className="flex gap-3 mt-3">
                  <input
                    placeholder="Key"
                    value={newSpec.key}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, key: e.target.value })
                    }
                    className="w-1/3 border rounded-md p-2"
                  />
                  <input
                    placeholder="Value"
                    value={newSpec.value}
                    onChange={(e) =>
                      setNewSpec({ ...newSpec, value: e.target.value })
                    }
                    className="flex-1 border rounded-md p-2"
                  />
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    <PlusCircle size={22} />
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          {selectedTab === 4 && (
            <button
              type="submit"
              disabled={!isFormValid || uploading}
              className={`px-5 py-2 rounded-md text-white font-medium transition ${
                !isFormValid || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {uploading
                ? "Uploading..."
                : id
                ? "Update Product"
                : "Create Product"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
