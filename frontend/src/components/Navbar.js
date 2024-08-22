import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAdmin, logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-lg font-bold">Pulse Pharmaceuticals Lunch Ordering</Link>
        <div>
          <Link to="/dashboard" className="text-white px-4">Dashboard</Link>
          {isAdmin() && <Link to="/admin" className="text-white px-4">Admin</Link>}
          {isAuthenticated() && (
            <button onClick={handleLogout} className="text-white px-4">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;