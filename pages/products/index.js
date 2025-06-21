import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "../../graphql/queries";
import Link from "next/link";

export default function ProductsPage() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our T-Shirt Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-lg font-bold mt-2">
                Rp {product.price.toLocaleString()}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <Link
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details
                </Link>
                <a
                  href={`https://wa.me/6281234567890?text=I want to order ${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
}
