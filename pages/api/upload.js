import { imagekit } from '../../lib/imagekit';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { file, fileName } = req.body;
    const result = await imagekit.upload({
      file,
      fileName,
      folder: '/products',
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
}