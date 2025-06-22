// /pages/admin/products.js
import { useState } from 'react';

export default function AdminProductPage() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState(null);

  const submitProduct = async () => {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div>
      <h1>Tambah Produk</h1>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Nama Produk"
      />
      <button onClick={submitProduct}>Submit</button>
      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
    </div>
  );
}
