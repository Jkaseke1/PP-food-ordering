import React, { useState } from 'react';
import axios from 'axios';

const PrintList = () => {
  const [caterer, setCaterer] = useState('');
  const [day, setDay] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/print-list/${caterer}/${day}`);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Print List by Caterer/Day</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-semibold mb-2">Caterer</label>
          <input
            type="text"
            value={caterer}
            onChange={(e) => setCaterer(e.target.value)}
            placeholder="Caterer"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Day</label>
          <input
            type="text"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="Day"
            className="w-full p-2 border rounded"
          />
        </div>
        <button onClick={fetchOrders} className="bg-blue-500 text-white px-4 py-2 rounded">Fetch Orders</button>
      </div>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(orders, null, 2)}</pre>
    </div>
  );
};

export default PrintList;