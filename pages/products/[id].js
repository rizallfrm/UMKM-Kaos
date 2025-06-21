import { useQuery } from '@apollo/client';
import { GET_PRODUCT } from '../../graphql/queries';

export default function ProductDetail({ id }) {
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const product = data.product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold mt-4">Rp {product.price.toLocaleString()}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Available Sizes</h2>
            <div className="flex gap-2 mt-2">
              {product.sizes.map(size => (
                <span key={size} className="px-3 py-1 bg-gray-200 rounded">
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Available Colors</h2>
            <div className="flex gap-2 mt-2">
              {product.colors.map(color => (
                <span 
                  key={color} 
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <a 
            href={`https://wa.me/6281234567890?text=I want to order ${product.name}`} 
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // In a real app, you would fetch product IDs from your API
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
    revalidate: 60, // ISR: revalidate every 60 seconds
  };
}