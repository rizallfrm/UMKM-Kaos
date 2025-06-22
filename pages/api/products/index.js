import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '../../../lib/firebase-admin';

const db = getFirestore(adminApp);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('products').add(productData);
    res.status(200).json({ id: docRef.id });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Gagal menambahkan produk' });
  }
}
