import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { login } from '../utils/auth'; // Assuming this function handles token storage
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!email || !password) {
      setError('Please enter both email and password.');
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('userId', data.userId); // Store user ID here
      login(data.token, data.role); // Save token and role
      toast.success('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000); // Redirect to dashboard after 2 seconds
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials and try again.');
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border p-2 mb-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full mb-4">
            Login
          </button>
        </form>
        <div className="text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;