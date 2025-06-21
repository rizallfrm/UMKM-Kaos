import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          UMKM Kaos
        </Link>

        <div className="flex items-center space-x-4">
          {session?.user.role === "admin" && (
            <Link
              href="/admin/products/create"
              className="bg-white text-blue-600 px-4 py-2 rounded font-medium"
            >
              + Tambah Produk
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
