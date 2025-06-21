import { useQuery } from "@apollo/client";
import { GET_FEATURED_PRODUCTS } from "../graphql/queries";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import "../styles/globals.css";
export default function HomePage() {
  const { data: session, status } = useSession();
  const { loading, error, data } = useQuery(GET_FEATURED_PRODUCTS, {
    variables: { limit: 4 },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            UMKM Kaos
          </Link>

          <div className="flex items-center space-x-4">
            {status === "authenticated" ? (
              <>
                <div className="flex items-center">
                  <span className="mr-2">
                    {session.user.role === "admin" ? "👑" : "👤"}
                  </span>
                  <span className="font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                {session.user.role === "admin" && (
                  <Link href="/admin/dashboard">
                    <a className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded">
                      Admin Panel
                    </a>
                  </Link>
                )}

                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded font-medium"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="text-center mb-12 ">
        <h1 className="text-4xl font-bold mb-4">
          Selamat Datang di UMKM Kaos Kami
        </h1>
        <p className="text-xl mb-8">
          Temukan koleksi kaos berkualitas dengan harga terjangkau
        </p>

        {!session ? (
          <button
            onClick={() => signIn()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Login/Daftar Sekarang
          </button>
        ) : (
          <Link
            href="/products"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            Lihat Katalog
          </Link>
        )}
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Produk Unggulan</h2>

        {loading && <p>Memuat produk...</p>}
        {error && <p>Error: {error.message}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.products?.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow block"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-bold mt-2">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/products"
            className="text-blue-600 hover:underline inline-block"
          >
            Lihat Semua Produk →
          </Link>
        </div>
      </section>

      {/* UMKM Info Section */}
      <section className="bg-gray-100 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Tentang UMKM Kami</h2>
        <p className="mb-4">
          Kami adalah usaha kecil menengah yang berkomitmen untuk menghasilkan
          kaos berkualitas dengan bahan terbaik.
        </p>
        <p>
          Dukung produk lokal dan dapatkan harga spesial dengan membeli langsung
          melalui website ini.
        </p>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} UMKM Kaos - All Rights Reserved
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
