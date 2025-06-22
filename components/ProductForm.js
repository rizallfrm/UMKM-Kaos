import { useState } from "react";

const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL"];
const COLOR_OPTIONS = ["Merah", "Biru", "Hitam", "Putih", "Hijau"];

export default function ProductForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    sizes: [],
    colors: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload gagal");
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Gagal upload: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    const selected = form[type];
    const updated = checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);

    setForm({ ...form, [type]: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission triggered");

    // Validasi gambar
    if (!form.imageUrl) {
      console.log("Error: Gambar belum diupload");
      setUploadError("Harap upload gambar produk");
      return;
    }

    // Validasi ukuran dan warna
    if (form.sizes.length === 0) {
      console.log("Error: Ukuran belum dipilih");
      alert("Harap pilih minimal 1 ukuran");
      return;
    }

    if (form.colors.length === 0) {
      console.log("Error: Warna belum dipilih");
      alert("Harap pilih minimal 1 warna");
      return;
    }

    console.log("Submitting form data:", form);
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      // Pastikan colors adalah array string yang valid
      colors: form.colors.filter((color) => COLOR_OPTIONS.includes(color)),
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tambah Produk Fashion
          </h1>
          <p className="text-gray-600">
            Buat produk fashion terbaru untuk toko UMKM Anda
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="space-y-8">
            {/* Product Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Informasi Produk
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama produk fashion"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      Rp
                    </span>
                    <input
                      type="number"
                      name="price"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Produk
                </label>
                <textarea
                  name="description"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-none"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Deskripsikan detail produk fashion Anda..."
                />
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Gambar Produk
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    value={form.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {form.imageUrl && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                    <p className="text-sm text-gray-600 mb-2">
                      Preview Gambar:
                    </p>
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}

                {uploadError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                    <p className="text-red-600 text-sm">{uploadError}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Size and Color Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-purple-600 rounded-full"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Varian Produk
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Sizes */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Ukuran Tersedia
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {SIZE_OPTIONS.map((size) => (
                      <label
                        key={size}
                        className="relative cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          value={size}
                          checked={form.sizes.includes(size)}
                          onChange={(e) => handleCheckboxChange(e, "sizes")}
                          className="sr-only"
                        />
                        <div
                          className={`
                          w-full h-12 rounded-xl border-2 flex items-center justify-center font-semibold text-sm transition-all duration-200
                          ${
                            form.sizes.includes(size)
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg"
                              : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                          }
                          group-hover:scale-105
                        `}
                        >
                          {size}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Warna Tersedia
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {COLOR_OPTIONS.map((color) => (
                      <label
                        key={color}
                        className="relative cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          value={color}
                          checked={form.colors.includes(color)}
                          onChange={(e) => handleCheckboxChange(e, "colors")}
                          className="sr-only"
                        />
                        <div
                          className={`
                          w-full h-12 rounded-xl border-2 flex items-center justify-center font-semibold text-sm transition-all duration-200
                          ${
                            form.colors.includes(color)
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-lg"
                              : "bg-white border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
                          }
                          group-hover:scale-105
                        `}
                        >
                          {color}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Simpan Produk Fashion
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
