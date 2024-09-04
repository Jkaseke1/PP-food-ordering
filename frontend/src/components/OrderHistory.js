import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        toast.error('You must be logged in to view order history.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/orders?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        toast.error('Failed to load order history.');
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id}>
            <p>Caterer: {order.caterer}</p>
            <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            <ul>
              {order.selectedItems.map((item, index) => (
                <li key={index}>{item.category}: {item.name}</li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;