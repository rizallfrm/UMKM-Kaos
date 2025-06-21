import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import ProductForm from '../../../components/ProductForm';

export default function CreateProductPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Akses ditolak. Hanya admin yang bisa mengakses halaman ini.</p>
      </div>
    );
  }

  const handleSubmit = async (productData) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Gagal menambahkan produk:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tambah Produk Baru</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}