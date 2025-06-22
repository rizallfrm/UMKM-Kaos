import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT, UPDATE_PRODUCT } from '../../../../graphql/queries';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  
  // Get product data
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });
  
  // Update product mutation
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    sizes: [],
    colors: []
  });
  
  // Temporary state for new size/color
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  
  // Set initial form data when product data is loaded
  useEffect(() => {
    if (data?.product) {
      setFormData({
        name: data.product.name,
        description: data.product.description,
        price: data.product.price.toString(),
        imageUrl: data.product.imageUrl,
        sizes: [...data.product.sizes],
        colors: [...data.product.colors]
      });
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-violet-200 border-b-violet-500 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-center">
            <p className="text-rose-600 font-semibold text-lg">Memuat Produk Fashion</p>
            <p className="text-gray-500 text-sm mt-1">Sedang menyiapkan detail produk...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Terjadi Kesalahan</h3>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <button 
              onClick={() => router.back()}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize]
      });
      setNewSize('');
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter(size => size !== sizeToRemove)
    });
  };

  const handleAddColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData({
        ...formData,
        colors: [...formData.colors, newColor]
      });
      setNewColor('');
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter(color => color !== colorToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        variables: {
          id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          imageUrl: formData.imageUrl,
          sizes: formData.sizes,
          colors: formData.colors
        }
      });
      
      // Redirect to product list after successful update
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Gagal memperbarui produk: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-violet-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
                  Edit Produk Fashion
                </h1>
                <p className="text-gray-600 text-sm">Perbarui detail produk fashion Anda</p>
              </div>
            </div>
            <Link href="/"
              className="group flex items-center space-x-2 px-4 py-2 bg-white/80 hover:bg-white text-gray-700 hover:text-rose-600 rounded-xl border border-gray-200 hover:border-rose-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Kembali ke Katalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Image Preview Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Preview Produk
              </h3>
              <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt="Product preview" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400x400/F3F4F6/9CA3AF?text=Fashion+Item";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-sm">Preview akan muncul di sini</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Product Info Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Informasi Produk
                  </h3>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                      Nama Produk Fashion
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      placeholder="Contoh: Dress Casual Wanita"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-800 mb-2">
                      Deskripsi Produk
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md resize-none"
                      placeholder="Deskripsikan produk fashion Anda dengan detail..."
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-semibold text-gray-800 mb-2">
                      Harga Produk
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">Rp</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                        placeholder="150000"
                        required
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-800 mb-2">
                      URL Gambar Produk
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
                      placeholder="https://example.com/fashion-image.jpg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Ukuran Tersedia
                  </h3>
                  <p className="text-white/80 text-sm mt-1">Kelola varian ukuran produk fashion</p>
                </div>

                <div className="p-6">
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      placeholder="S, M, L, XL, XXL"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:from-violet-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah
                    </button>
                  </div>

                  {formData.sizes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size) => (
                        <div key={size} className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border border-violet-200 hover:from-violet-200 hover:to-purple-200 transition-all duration-300">
                          <span className="font-semibold">{size}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(size)}
                            className="ml-2 text-violet-500 hover:text-violet-700 opacity-70 group-hover:opacity-100 transition-all duration-300"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Colors Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                    Warna Tersedia
                  </h3>
                  <p className="text-white/80 text-sm mt-1">Kelola varian warna produk fashion</p>
                </div>

                <div className="p-6">
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      placeholder="Merah, #FF5733, Navy Blue"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Tambah
                    </button>
                  </div>

                  {formData.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color) => (
                        <div key={color} className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200 hover:from-emerald-200 hover:to-teal-200 transition-all duration-300">
                          <div 
                            className="w-4 h-4 rounded-full mr-2 border-2 border-white shadow-sm" 
                            style={{ backgroundColor: color.startsWith('#') ? color : color }}
                          />
                          <span className="font-medium">{color}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(color)}
                            className="ml-2 text-emerald-500 hover:text-emerald-700 opacity-70 group-hover:opacity-100 transition-all duration-300"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex-1 px-6 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}