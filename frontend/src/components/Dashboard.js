import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState({ entrees: null, starches: null, sides: null, desserts: null });
  const [menu, setMenu] = useState({
    Ruth: { entrees: [], starches: [], sides: [], desserts: [] },
    Makagi: { entrees: [], starches: [], sides: [], desserts: [] }
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCaterer, setSelectedCaterer] = useState('');
  const [orderDetails, setOrderDetails] = useState(null); // State to hold order details

  useEffect(() => {
    const loadMenu = () => {
      const updatedMenu = {
        Ruth: {
          entrees: [
            { name: 'Beef Stew' },
            { name: 'Chicken Stew' },
            { name: 'Guru Matambu' },
            { name: 'Smoked Sausage' },
            { name: 'Tbone' },
            { name: 'Gango' },
            { name: 'Roast' },
            { name: 'Mixed Grill' },
            { name: 'Chicken Burger' }
          ],
          starches: [
            { name: 'Chips' },
            { name: 'Wedges' },
            { name: 'Rice' },
            { name: 'Rice Dovi' },
            { name: 'Sadza' }
          ],
          sides: [
            { name: 'Mixed Vegetables' },
            { name: 'Butternut' }
          ],
          desserts: [
            { name: 'Fruitpack' }
          ]
        },
        Makagi: {
          entrees: [
            { name: 'Ground Beef with Sausage and Beans' },
            { name: 'Chicken Stew' },
            { name: 'Beef Stew' },
            { name: 'Mixed Grill' },
            { name: 'Chicken Roast' },
            { name: 'Bacon Burger' }
          ],
          starches: [
            { name: 'Spaghetti' },
            { name: 'Chips' },
            { name: 'Rice' },
            { name: 'Peanut Butter Rice' },
            { name: 'Sadza' }
          ],
          sides: [
            { name: 'Coleslaw' },
            { name: 'Mixed Vegetables' },
            { name: 'Leafy Green Vegetables' }
          ],
          desserts: [
            { name: 'Snack Pack (Crackers, Juice & Fruits)' },
            { name: 'Fruitpack (Fruits and Yoghurt)' }
          ]
        }
      };
      setMenu(updatedMenu);
    };
    loadMenu();
  }, []);

  const handleItemClick = (item, category, caterer) => {
    if (selectedCaterer && selectedCaterer !== caterer) {
      toast.error('You can only select items from one caterer.');
      return;
    }
    setSelectedCaterer(caterer);
    setSelectedItems(prevState => ({
      ...prevState,
      [category]: prevState[category]?.name === item.name ? null : item
    }));
  };

  const handleSubmit = async () => {
    if (!selectedItems.entrees || !selectedItems.starches) {
      toast.error('Please select at least an entree and a starch.');
      return;
    }

    const selectedItemsArray = Object.entries(selectedItems)
      .filter(([category, item]) => item !== null)
      .map(([category, item]) => ({ category, name: item.name }));

    try {
      const token = localStorage.getItem('token'); // Ensure token is retrieved
      const userId = localStorage.getItem('userId'); // Ensure userId is retrieved

      if (!token || !userId) {
        toast.error('You must be logged in to place an order.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const orderPayload = {
        user: userId, // Pass the user ID here
        caterer: selectedCaterer,
        date: selectedDate.toISOString(),
        selectedItems: selectedItemsArray
      };

      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, config);
      toast.success('Order placed successfully!');
      setOrderDetails(response.data); // Set the order details to state
      setSelectedItems({ entrees: null, starches: null, sides: null, desserts: null });
      setSelectedCaterer('');
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-blue-700">Lunch Ordering Dashboard</h1>
        <button
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Select Date</h2>
        <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className="border p-2 rounded w-full" />
      </div>

      {/* Display Ordered Menu Section */}
      {orderDetails && (
        <div className="bg-green-100 p-4 rounded mb-6">
          <h2 className="text-xl font-bold">Your Ordered Menu</h2>
          <p><strong>Caterer:</strong> {orderDetails.caterer}</p>
          <p><strong>Date:</strong> {new Date(orderDetails.date).toLocaleDateString()}</p>
          <h3 className="font-semibold mt-4">Selected Items:</h3>
          <ul className="list-disc pl-5">
            {orderDetails.selectedItems.map((item, index) => (
              <li key={index}>{item.category}: {item.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(menu).map(([caterer, categories]) => (
          <div key={caterer} className="bg-white p-4 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">{caterer}</h2>
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="font-semibold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 border rounded cursor-pointer hover:bg-blue-100 transition duration-300 ${selectedItems[category]?.name === item.name ? 'bg-blue-200' : ''}`}
                      onClick={() => handleItemClick(item, category, caterer)}
                    >
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Selected Items</h2>
        {Object.values(selectedItems).some(item => item !== null) ? (
          <ul className="list-disc pl-5">
            {Object.entries(selectedItems).map(([category, item], index) => (
              item && <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No items selected yet.</p>
        )}
      </div>
      <div className="mt-6">
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300" onClick={handleSubmit}>
          Place Order
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Dashboard;