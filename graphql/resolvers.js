import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export const resolvers = {
  Query: {
    products: async (
      _,
      { limit: limitArg, orderBy: orderByArg, orderDirection },
      { clientDb }
    ) => {
      try {
        let q = query(collection(clientDb, "products"));

        if (orderByArg) {
          q = query(q, orderBy(orderByArg, orderDirection || "asc"));
        }

        if (limitArg) {
          q = query(q, limit(limitArg));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
      }
    },

    product: async (_, { id }) => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    users: async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          email: data.email || "",
          name: data.name || "Unknown",
          role: data.role || "user",
          createdAt: data.createdAt || new Date().toISOString(),
        };
      });
    },

    getProductReviews: async (_, { productId }, { clientDb }) => {
      try {
        const reviewsRef = collection(
          clientDb,
          "products",
          productId,
          "reviews"
        );
        const snapshot = await getDocs(reviewsRef);

        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt || new Date().toISOString(),
        }));
      } catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Failed to fetch reviews");
      }
    },
  },

  Product: {
    reviews: async (parent, _, { clientDb }) => {
      const reviewsRef = collection(clientDb, "products", parent.id, "reviews");
      const snapshot = await getDocs(reviewsRef);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString(),
      }));
    },
  },

  Mutation: {
    createProduct: async (_, args, { adminDb }) => {
      const docRef = await adminDb.collection("products").add({
        ...args,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...args };
    },

    updateProduct: async (_, { id, ...args }) => {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, args);
      return { id, ...args };
    },

    deleteProduct: async (_, { id }) => {
      await deleteDoc(doc(db, "products", id));
      return true;
    },
    updateUser: async (_, { id, ...args }) => {
      const userRef = doc(db, "users", id);
      await updateDoc(userRef, args);
      return { id, ...args };
    },
    deleteUser: async (_, { id }) => {
      await deleteDoc(doc(db, "users", id));
      return true;
    },

    addProductReview: async (
      _,
      { productId, rating, comment },
      { adminDb, user }
    ) => {
      if (!user) {
        throw new Error("Anda harus login untuk memberikan ulasan");
      }

      // Validasi rating
      if (rating < 1 || rating > 5) {
        throw new Error("Rating harus antara 1 sampai 5");
      }

      const reviewData = {
        productId,
        userId: user.id,
        userName: user.name || "Pengguna",
        userAvatar: user.image || null,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
      };

      try {
        // Gunakan adminDb untuk menulis data
        const docRef = await adminDb
          .collection("products")
          .doc(productId)
          .collection("reviews")
          .add(reviewData);

        console.log("Review added:", { id: docRef.id, ...reviewData });

        // Update rating produk
        await updateProductAverageRating(adminDb, productId);

        return { id: docRef.id, ...reviewData };
      } catch (error) {
        console.error("Error adding review:", error);
        throw new Error("Gagal menambahkan ulasan");
      }
    },
  },
};

async function updateProductAverageRating(adminDb, productId) {
  console.log(`Updating average rating for product: ${productId}`);
  
  try {
    const reviewsSnapshot = await adminDb
      .collection("products")
      .doc(productId)
      .collection("reviews")
      .get();

    let totalRating = 0;
    let reviewCount = 0;

    reviewsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.rating) {
        totalRating += data.rating;
        reviewCount++;
      }
    });

    const updates = {
      updatedAt: new Date().toISOString()
    };

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

    console.log("Product rating updated:", updates);
  } catch (error) {
    console.error("Error updating product rating:", error);
    throw error;
  }
}