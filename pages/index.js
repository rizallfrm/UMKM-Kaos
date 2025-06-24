import { useQuery } from "@apollo/client";
import { GET_FEATURED_PRODUCTS } from "../graphql/queries";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import "../styles/globals.css";
import ProductForm from "../components/ProductForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { CREATE_PRODUCT } from "../graphql/queries";
import { ChevronLeft, LayoutDashboard, Menu, Package, X } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();

  const { loading, error, data } = useQuery(GET_FEATURED_PRODUCTS, {
    variables: {
      limit: 4,
      orderBy: "createdAt",
      orderDirection: "desc",
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      // Close sidebar if resizing to desktop view
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSubmit = async (productData) => {
    try {
      await createProduct({
        variables: {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          imageUrl: productData.imageUrl,
          sizes: productData.sizes,
          colors: productData.colors,
        },
      });

      setIsModalOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Gagal membuat produk:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Admin Sidebar */}
      {session?.user?.role === "admin" && (
        <>
          {/* Toggle Button - Selalu terlihat */}
          <button
            onClick={toggleSidebar}
            className={`fixed z-50 p-2 rounded-md bg-white shadow-md transition-all duration-300 hover:bg-gray-100
        ${isSidebarOpen ? "left-64" : "left-4"} 
        top-4 lg:top-6 lg:left-6`}
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Overlay hanya untuk mobile */}
          {isSidebarOpen && isMobile && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed top-0 left-0 h-screen bg-white shadow-xl z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "w-64" : "w-0 lg:w-20"} 
        overflow-hidden`}
          >
            <div className="h-full flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between h-16">
                {isSidebarOpen ? (
                  <h2 className="text-lg font-semibold text-gray-800 whitespace-nowrap">
                    Admin Dashboard
                  </h2>
                ) : (
                  <h2 className="text-lg font-semibold text-gray-800">AD</h2>
                )}
                {isSidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Sidebar Content */}
              <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/admin/dashboard"
                      className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${
                    router.pathname === "/admin/dashboard"
                      ? "bg-purple-50 text-purple-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                  ${!isSidebarOpen && "justify-center"}`}
                      onClick={() => isMobile && toggleSidebar()}
                    >
                      <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                      {isSidebarOpen && (
                        <span className="ml-3 whitespace-nowrap">
                          Dashboard Overview
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Modern Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">👕</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StyleHub
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Fashion UMKM</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              {status === "authenticated" ? (
                <div className="flex items-center space-x-4">
                  {session?.user.role === "admin" && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <span className="text-lg">+</span>
                      <span className="font-medium">Tambah Produk</span>
                    </button>
                  )}

                  <div className="flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">
                        {session.user.role === "admin" ? "👑" : "👤"}
                      </span>
                    </div>
                    <span className="font-medium text-gray-700 text-sm">
                      {session.user.name || session.user.email}
                    </span>
                  </div>

                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
                >
                  Masuk
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tambah Produk Baru
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Lengkapi informasi produk fashion Anda
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <ProductForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Modern Design */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gray-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">
                Produk Fashion Lokal Terbaik
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Fashion Berkualitas
              </span>
              <br />
              <span className="text-gray-800">untuk Gaya Anda</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Temukan koleksi fashion terlengkap dari UMKM lokal dengan kualitas
              premium dan harga yang terjangkau
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!session ? (
                <button
                  onClick={() => signIn()}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold text-lg flex items-center space-x-2"
                >
                  <span>Mulai Berbelanja</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
              ) : (
                <Link
                  href="/products"
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold text-lg flex items-center space-x-2"
                >
                  <span>Jelajahi Katalog</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-600"
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
                  </div>
                  <span>Kualitas Terjamin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <span>Harga Terjangkau</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Featured Products with Modern Cards */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Koleksi{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Unggulan
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Produk fashion pilihan yang sedang trending dari berbagai UMKM lokal
            terpercaya
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Memuat produk terbaru...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-red-800 font-medium">
              Terjadi kesalahan saat memuat produk
            </p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data?.products?.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-xs text-gray-500">Mulai dari</span>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">
                        Stok tersedia
                      </span>
                    </div>
                  </div>

                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="group inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-purple-200 text-purple-600 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 font-semibold"
          >
            <span>Lihat Semua Produk</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 border-y border-purple-100">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tentang{" "}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  StyleHub
                </span>
              </h2>
              <p className="text-gray-600 text-lg">
                Mendukung UMKM Fashion Indonesia
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Kualitas Premium
                    </h3>
                    <p className="text-gray-600">
                      Kami berkomitmen menghadirkan produk fashion berkualitas
                      tinggi dengan bahan terbaik dan desain yang trendy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20a3 3 0 01-3-3v-2a3 3 0 013-3h4a3 3 0 013 3v2a3 3 0 01-3 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Mendukung UMKM Lokal
                    </h3>
                    <p className="text-gray-600">
                      Setiap pembelian Anda berkontribusi langsung untuk
                      mendukung dan mengembangkan UMKM fashion Indonesia.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      Harga Terjangkau
                    </h3>
                    <p className="text-gray-600">
                      Dapatkan produk fashion berkualitas dengan harga yang
                      ramah di kantong melalui platform kami.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        500+
                      </div>
                      <div className="text-gray-600 text-sm">
                        Produk Fashion
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        50+
                      </div>
                      <div className="text-gray-600 text-sm">UMKM Partner</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        1000+
                      </div>
                      <div className="text-gray-600 text-sm">Customer Puas</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-pink-600 mb-2">
                        4.8★
                      </div>
                      <div className="text-gray-600 text-sm">
                        Rating Rata-rata
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">👕</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">StyleHub</h3>
                  <p className="text-gray-400 text-sm">Fashion UMKM</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Platform fashion terdepan yang menghubungkan UMKM lokal dengan
                customer di seluruh Indonesia. Wujudkan gaya impian Anda dengan
                produk berkualitas.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.197.232.225.435.166.672-.09.381-.293 1.188-.334 1.355-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001.001 12.017.001z" />
                  </svg>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.549 21.105c-1.899-.538-4.096-1.287-5.405-1.844l-.976-.415.133-.576c.096-.416.106-.429.229-.303.074.076.487.285 1.025.518 1.26.544 2.462.927 4.024 1.283l1.004.229-.034.108zm7.27-3.958l-.542-.498-.287.327c-.15.171-.611.486-.97.661-.345.169-.625.361-.625.427 0 .126.766-.047 1.33-.301.438-.197.944-.477 1.094-.616l.542-.498zm-6.808-1.306c-.329-.031-.809-.117-1.068-.191l-.471-.134-.049.337c-.034.232-.011.345.074.363.068.014.323.083.566.152.442.125.509.131.875.075.362-.055.404-.072.34-.139-.044-.046-.133-.068-.267-.068zm-4.026-.674c-.329-.043-.747-.165-.925-.271l-.323-.193.031-.314c.02-.211.054-.314.103-.314.04 0 .302.088.583.196.535.205.645.226 1.033.201.322-.021.359-.035.276-.105-.055-.046-.138-.069-.185-.05-.046.019-.132-.004-.19-.051-.139-.113-.079-.131.36-.109.361.018.452.005.526-.073.117-.124.066-.152-.311-.171z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Navigasi</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="/products"
                    className="hover:text-white transition-colors"
                  >
                    Semua Produk
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="hover:text-white transition-colors"
                  >
                    Kategori
                  </a>
                </li>
                <li>
                  <a
                    href="/brands"
                    className="hover:text-white transition-colors"
                  >
                    Brand UMKM
                  </a>
                </li>
                <li>
                  <a
                    href="/sale"
                    className="hover:text-white transition-colors"
                  >
                    Sale & Promo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Bantuan</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Hubungi Kami
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/shipping"
                    className="hover:text-white transition-colors"
                  >
                    Pengiriman
                  </a>
                </li>
                <li>
                  <a
                    href="/returns"
                    className="hover:text-white transition-colors"
                  >
                    Pengembalian
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} StyleHub - Platform Fashion UMKM
              Indonesia. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Kebijakan Privasi
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Syarat & Ketentuan
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60, // ISR: regenerate every 60 seconds
  };
}
