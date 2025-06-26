import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useMutation } from "@apollo/client";
import {
  ADD_PRODUCT_REVIEW,
  GET_PRODUCT,
  GET_PRODUCT_REVIEWS,
} from "../graphql/queries";

const ReviewForm = ({ productId }) => {
  const { data: session, status } = useSession();
  const [addReview, { loading, error }] = useMutation(ADD_PRODUCT_REVIEW, {
    refetchQueries: [
      { query: GET_PRODUCT_REVIEWS, variables: { productId } },
      { query: GET_PRODUCT, variables: { id: productId } },
    ],
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status !== "authenticated") {
      signIn();
      return;
    }

    try {
      const response = await fetch("/api/reviews/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid response from server");
      }
      if (!response.ok) {
        throw new Error(data.error || "Gagal mengirim ulasan");
      }

      setSuccessMessage("Ulasan berhasil dikirim!");
      setComment("");
      setTimeout(() => {
        setSuccessMessage("");
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      console.error("Error:", err.message);
    }
  };
  // Komponen bintang rating
  const StarRating = () => {
    return (
      <div className="flex items-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-gray-600">{rating}.0</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Berikan Ulasan Anda</h3>

      {status !== "authenticated" ? (
        <div className="text-center py-4">
          <p className="mb-4">Anda perlu login untuk memberikan ulasan</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Login Sekarang
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <StarRating />

          <div className="mb-4">
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Ulasan Anda
            </label>
            <textarea
              id="comment"
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Bagaimana pengalaman Anda dengan produk ini?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error.message.replace("GraphQL error: ", "")}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
