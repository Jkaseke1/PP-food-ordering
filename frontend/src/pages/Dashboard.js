import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaAppleAlt, FaCarrot, FaDrumstickBite, FaIceCream } from 'react-icons/fa';

const Dashboard = () => {
  const [selectedItems, setSelectedItems] = useState({ entrees: null, starches: null, sides: null, desserts: null });
  const [menu, setMenu] = useState({
    Ruth: { entrees: [], starches: [], sides: [], desserts: [] },
    Makagi: { entrees: [], starches: [], sides: [], desserts: [] }
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCaterer, setSelectedCaterer] = useState('');

  useEffect(() => {
    const loadMenu = async () => {
      const updatedMenu = {
        Ruth: {
          entrees: [
            { name: 'Beef Stew', icon: <FaDrumstickBite /> },
            { name: 'Chicken Stew', icon: <FaDrumstickBite /> },
            { name: 'Guru Matambu', icon: <FaDrumstickBite /> },
            { name: 'Smoked Sausage', icon: <FaDrumstickBite /> },
            { name: 'Tbone', icon: <FaDrumstickBite /> },
            { name: 'Gango', icon: <FaDrumstickBite /> },
            { name: 'Roast', icon: <FaDrumstickBite /> },
            { name: 'Mixed Grill', icon: <FaDrumstickBite /> },
            { name: 'Chicken Burger', icon: <FaDrumstickBite /> }
          ],
          starches: [
            { name: 'Chips', icon: <FaCarrot /> },
            { name: 'Wedges', icon: <FaCarrot /> },
            { name: 'Rice', icon: <FaCarrot /> },
            { name: 'Rice Dovi', icon: <FaCarrot /> },
            { name: 'Sadza', icon: <FaCarrot /> }
          ],
          sides: [
            { name: 'Mixed Vegetables', icon: <FaCarrot /> },
            { name: 'Butternut', icon: <FaCarrot /> }
          ],
          desserts: [
            { name: 'Fruitpack', icon: <FaAppleAlt /> }
          ]
        },
        Makagi: {
          entrees: [
            { name: 'Ground Beef with Sausage and Beans', icon: <FaDrumstickBite /> },
            { name: 'Chicken Stew', icon: <FaDrumstickBite /> },
            { name: 'Beef Stew', icon: <FaDrumstickBite /> },
            { name: 'Mixed Grill', icon: <FaDrumstickBite /> },
            { name: 'Chicken Roast', icon: <FaDrumstickBite /> },
            { name: 'Bacon Burger', icon: <FaDrumstickBite /> }
          ],
          starches: [
            { name: 'Spaghetti', icon: <FaCarrot /> },
            { name: 'Chips', icon: <FaCarrot /> },
            { name: 'Rice', icon: <FaCarrot /> },
            { name: 'Peanut Butter Rice', icon: <FaCarrot /> },
            { name: 'Sadza', icon: <FaCarrot /> }
          ],
          sides: [
            { name: 'Coleslaw', icon: <FaCarrot /> },
            { name: 'Mixed Vegetables', icon: <FaCarrot /> },
            { name: 'Leafy Green Vegetables', icon: <FaCarrot /> }
          ],
          desserts: [
            { name: 'Snack Pack (Crackers, Juice & Fruits)', icon: <FaIceCream /> },
            { name: 'Fruitpack (Fruits and Yoghurt)', icon: <FaAppleAlt /> }
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
    setSelectedItems(prevState => ({ ...prevState, [category]: prevState[category]?.name === item.name ? null : item }));
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
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
      if (!token) {
        toast.error('You must be logged in to place an order.');
        return;
      }
      if (!userId) {
        toast.error('User ID not found. Please log in again.'); // Handle missing user ID
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const orderPayload = {
        userId,
        caterer: selectedCaterer,
        date: selectedDate.toISOString(),
        meal: 'Sample Meal', // Replace with actual meal selection logic
        quantity: 1, // Replace with actual quantity selection logic
        selectedItems: selectedItemsArray
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/order`, orderPayload, config);
      toast.success('Order placed successfully!');
      setSelectedItems({ entrees: null, starches: null, sides: null, desserts: null });
      setSelectedCaterer('');
    } catch (error) {
      console.error('Failed to place order:', error);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Unauthorized. Please log in again.');
        } else {
          toast.error(`Failed to place order: ${error.response.data.message || 'Please try again.'}`);
        }
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Select Date</h2>
        <div className="flex items-center">
          <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} className="border p-2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(menu).map(([caterer, categories]) => (
          <div key={caterer}>
            <h2 className="text-2xl font-bold mb-4">{caterer}</h2>
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className="mb-6">
                <h3 className="font-semibold mb-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-2 border rounded cursor-pointer ${selectedItems[category]?.name === item.name ? 'bg-blue-200' : ''}`}
                      onClick={() => handleItemClick(item, category, caterer)}
                    >
                      <span className="mr-4">{item.icon}</span>
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
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleSubmit}>
          Place Order
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;