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
  },
};
