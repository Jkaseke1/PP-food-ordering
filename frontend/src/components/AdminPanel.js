import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newMenu, setNewMenu] = useState({ caterer: '', items: [] });
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        toast.error('You must be logged in to view this page.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.email !== 'jkaseke@tpg.co.zw') {
          toast.error('You do not have access to this page.');
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to verify admin status.');
        navigate('/dashboard');
      }
    };

    checkAdmin();
    loadMenus();
    loadOrders();
  }, [navigate]);

  const loadMenus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu');
      setMenus(response.data);
    } catch (error) {
      toast.error('Failed to load menus.');
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders.');
    }
  };

  const handleAddItem = () => {
    const newItem = { name: itemName, description: itemDescription, price: itemPrice };
    setNewMenu(prev => ({ ...prev, items: [...prev.items, newItem] }));
    setItemName('');
    setItemDescription('');
    setItemPrice('');
  };

  const handleSubmitMenu = async () => {
    try {
      await axios.post('http://localhost:5000/api/menu', newMenu);
      toast.success('Menu added successfully!');
      setNewMenu({ caterer: '', items: [] });
      loadMenus();
    } catch (error) {
      toast.error('Failed to add menu.');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>

      <h2>Add New Menu</h2>
      <input
        type="text"
        placeholder="Caterer Name"
        value={newMenu.caterer}
        onChange={(e) => setNewMenu({ ...newMenu, caterer: e.target.value })}
      />
      <div>
        <h3>Add Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Item Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Item Price"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>
      <button onClick={handleSubmitMenu}>Submit Menu</button>

      <h2>Current Menus</h2>
      {menus.map(menu => (
        <div key={menu._id}>
          <h3>{menu.caterer}</h3>
          <ul>
            {menu.items.map((item, index) => (
              <li key={index}>{item.name} - {item.description} (${item.price})</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <p>User: {order.user.username}</p>
          <p>Caterer: {order.caterer}</p>
          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
          <ul>
            {order.selectedItems.map((item, index) => (
              <li key={index}>{item.category}: {item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;