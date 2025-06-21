import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const resolvers = {
  Query: {
    products: async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    product: async (_, { id }) => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    },
    users: async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  },
  Mutation: {
    createProduct: async (_, args) => {
      const docRef = await addDoc(collection(db, 'products'), {
        ...args,
        createdAt: new Date().toISOString(),
      });
      return { id: docRef.id, ...args };
    },
    updateProduct: async (_, { id, ...args }) => {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, args);
      return { id, ...args };
    },
    deleteProduct: async (_, { id }) => {
      await deleteDoc(doc(db, 'products', id));
      return true;
    },
  },
};