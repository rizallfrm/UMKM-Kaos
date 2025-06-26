import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { adminDb } from "@/lib/firebase-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productId, rating, comment } = req.body;

    // Validasi input
    if (!productId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const reviewData = {
      productId,
      userId: session.user.id,
      userName: session.user.name || "Pengguna",
      userAvatar: session.user.image || null,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    // Tambahkan review
    const reviewRef = await adminDb
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .add(reviewData);

    // Update rating produk
    await updateProductAverageRating(adminDb, productId);

    return res.status(200).json({ 
      success: true, 
      review: { id: reviewRef.id, ...reviewData } 
    });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateProductAverageRating(adminDb, productId) {
  const reviewsSnapshot = await adminDb
    .collection("products")
    .doc(productId)
    .collection("reviews")
    .get();

  let totalRating = 0;
  let reviewCount = 0;

  reviewsSnapshot.forEach((doc) => {
    const review = doc.data();
    if (review.rating) {
      totalRating += review.rating;
      reviewCount++;
    }
  });

  const updates = {};
  
  if (reviewCount > 0) {
    updates.averageRating = parseFloat((totalRating / reviewCount).toFixed(1));
    updates.reviewCount = reviewCount;
  } else {
    updates.averageRating = null;
    updates.reviewCount = 0;
  }

  await adminDb
    .collection("products")
    .doc(productId)
    .update(updates);
}