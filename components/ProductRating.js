import { useQuery } from "@apollo/client";
import { GET_PRODUCT } from "../graphql/queries";

const ProductRating = ({ productId }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: productId },
    fetchPolicy: "cache-and-network" // Untuk mendapatkan data terbaru
  });

  if (loading) return <div className="text-sm text-gray-500">Memuat...</div>;
  if (error) {
    console.error("Error loading product rating:", error);
    return <div className="text-sm text-red-500">Error loading rating</div>;
  }

  const product = data?.product;
  const averageRating = product?.averageRating || 0;
  const reviewCount = product?.reviewCount || 0;

  return (
    <div className="flex items-center">
      <div className="flex mr-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(averageRating) 
                ? "text-yellow-400" 
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-600">
        {averageRating.toFixed(1)} ({reviewCount} ulasan)
      </span>
    </div>
  );
};

export default ProductRating;