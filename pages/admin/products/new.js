import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT } from '../../../graphql/queries';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';

export default function NewProduct() {
  const router = useRouter();
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFormData({
        ...formData,
        imageUrl: data.url,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        variables: {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          sizes: formData.sizes,
          colors: formData.colors,
          imageUrl: formData.imageUrl,
        },
      });
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Product Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="w-full px-3 py-2 border rounded"
            accept="image/*"
            required
          />
          {uploading && <p className="text-gray-500">Uploading image...</p>}
          {formData.imageUrl && (
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? 'Saving...' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}