import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedOrders, setGroupedOrders] = useState({});
  const [email, setEmail] = useState('');
  const [statementPeriod, setStatementPeriod] = useState('weekly');
  const [expandedCaterers, setExpandedCaterers] = useState({}); // Track expanded caterers
  const [expandedUser, setExpandedUser] = useState(null); // Track expanded user
  const [menu, setMenu] = useState({});
  const [isOrderingLocked, setIsOrderingLocked] = useState(false);
  const adminEmails = ['jkaseke@tpg.co.zw', 'vkatsande@tpg.co.zw', 'tchivinge@tpg.co.zw'];

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/orders`, config);
        if (Array.isArray(data)) {
          setOrders(data);
          groupOrdersByCatererAndDate(data);
        } else {
          setError('Unexpected data format.');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchMenu = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        return;
      }

      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/menu`, config);
        console.log('Fetched menu data:', data);
        setMenu(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setError('Failed to fetch menu. Please try again later.');
      }
    };

    fetchOrders();
    fetchMenu(); // Fetch menu data on component mount
  }, []);

  const groupOrdersByCatererAndDate = (orders) => {
    const grouped = orders.reduce((acc, order) => {
      const date = new Date(order.date).toLocaleDateString();
      if (!acc[order.caterer]) {
        acc[order.caterer] = {};
      }
      if (!acc[order.caterer][date]) {
        acc[order.caterer][date] = {};
      }
      if (!acc[order.caterer][date][order.userId.email]) {
        acc[order.caterer][date][order.userId.email] = [];
      }
      acc[order.caterer][date][order.userId.email].push(order);
      return acc;
    }, {});
    setGroupedOrders(grouped);
  };

  const sendOrdersToEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const emailAddresses = adminEmails.join(', ');
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/send-orders`, { email: emailAddresses, orders }, config);
      toast.success('Orders sent to email successfully!'); // Use Toastify for notifications
    } catch (error) {
      console.error('Failed to send orders to email:', error);
      toast.error('Failed to send orders to email. Please try again later.'); // Use Toastify for notifications
    }
  };

  const compileFinancialStatement = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/financial-statement`, { period: statementPeriod }, config);
      toast.success(`Financial statement for ${statementPeriod} period compiled successfully!`); // Use Toastify for notifications
      console.log('Financial Statement:', data);
    } catch (error) {
      console.error('Failed to compile financial statement:', error);
      toast.error('Failed to compile financial statement. Please try again later.'); // Use Toastify for notifications
    }
  };

  const handleToggleExpandCaterer = (caterer) => {
    setExpandedCaterers(prevState => ({
      ...prevState,
      [caterer]: !prevState[caterer] // Toggle the specific caterer
    }));
    setExpandedUser(null); // Reset expanded user when toggling caterer
  };

  const handleToggleExpandUser = (userName) => {
    setExpandedUser(expandedUser === userName ? null : userName);
  };

  const handleToggleLockOrdering = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/toggle-order-verification`, { isOrderingLocked: !isOrderingLocked }, config);
      setIsOrderingLocked(!isOrderingLocked);
      toast.success(`Ordering has been ${isOrderingLocked ? 'unlocked' : 'locked'}.`); // Use Toastify for notifications
    } catch (error) {
      console.error('Failed to toggle ordering:', error);
      toast.error('Failed to toggle ordering. Please try again later.'); // Use Toastify for notifications
    }
  };

  const handleMenuChange = (caterer, category, index, value) => {
    const updatedMenu = { ...menu };
    if (!updatedMenu[caterer] || !updatedMenu[caterer][category] || !updatedMenu[caterer][category][index]) {
      console.error('Invalid menu structure');
      return;
    }
    updatedMenu[caterer][category][index].name = value;
    setMenu(updatedMenu);
  };

  const handleSaveMenu = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in again.');
      return;
    }
    try {
      const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
      await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/menu`, { menu }, config);
      toast.success('Menu saved successfully!'); // Use Toastify for notifications
    } catch (error) {
      console.error('Failed to save menu:', error);
      toast.error('Failed to save menu. Please try again later.'); // Use Toastify for notifications
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="loader">Loading...</div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {/* Admin Functions */}
          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Send Orders to Email</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email (optional)"
                className="border p-2 rounded mb-4"
              />
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={sendOrdersToEmail}
              >
                Send Orders
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Compile Financial Statement</h2>
              <select
                value={statementPeriod}
                onChange={(e) => setStatementPeriod(e.target.value)}
                className="border p-2 rounded mb-4"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={compileFinancialStatement}
              >
                Compile Statement
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Edit Caterers' Menu</h2>
              {Object.entries(menu).map(([caterer, categories]) => (
                <div key={caterer}>
                  <h3 className="text-xl font-bold mb-2">{caterer}</h3>
                  {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="mb-4">
                      <h4 className="font-semibold mb-2">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h4>
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleMenuChange(caterer, category, index, e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={handleSaveMenu}
              >
                Save Menu
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Lock Ordering</h2>
              <button
                className={`py-2 px-4 rounded ${isOrderingLocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                onClick={handleToggleLockOrdering}
              >
                {isOrderingLocked ? 'Unlock Ordering' : 'Lock Ordering'}
              </button>
            </div>
          </div>
          {/* User Orders */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">User Orders</h2>
            {Object.entries(groupedOrders).length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="flex flex-wrap gap-6">
                {Object.entries(groupedOrders).map(([caterer, dates]) => (
                  <div key={caterer} className="flex-1">
                    <h3
                      className="text-xl font-bold mb-2 cursor-pointer"
                      onClick={() => handleToggleExpandCaterer(caterer)}
                    >
                      {caterer}
                    </h3>
                    {expandedCaterers[caterer] && ( // Use expandedCaterers to check if the caterer is expanded
                      <div className="pl-4">
                        {Object.entries(dates).map(([date, users]) => (
                          <div key={date} className="mb-4">
                            <h4 className="font-semibold mb-2">{date}</h4>
                            {Object.entries(users).map(([userName, userOrders], index) => (
                              <div key={userName} className="mb-2">
                                <div
                                  className="font-semibold cursor-pointer"
                                  onClick={() => handleToggleExpandUser(userName)}
                                >
                                  {index + 1}. {userName}
                                </div>
                                {expandedUser === userName && (
                                  <div className="pl-4">
                                    {userOrders.length > 0 ? (
                                      userOrders.map((order, orderIndex) => (
                                        <div key={orderIndex} className="border p-4 rounded mb-4">
                                          <ul>
                                            {order.selectedItems && order.selectedItems.length > 0 ? (
                                              order.selectedItems.map((item, idx) => (
                                                <li key={idx}>{item.name}</li>
                                              ))
                                            ) : (
                                              <li>No items in this order.</li>
                                            )}
                                          </ul>
                                        </div>
                                      ))
                                    ) : (
                                      <p>No orders found for this user.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <ToastContainer /> {/* Include ToastContainer for notifications */}
    </div>
  );
};

export default AdminDashboard;