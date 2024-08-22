import React from 'react';
import axios from 'axios';

const SendOrders = () => {
  const handleSendOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-orders`, {}, config);
      alert('Orders sent to email successfully');
    } catch (error) {
      console.error('Failed to send orders:', error);
      alert('Failed to send orders');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Send Orders to Email</h1>
      <button onClick={handleSendOrders} className="bg-blue-500 text-white px-4 py-2 rounded">Send Orders</button>
    </div>
  );
};

export default SendOrders;