import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { 
        email, 
        password, 
        firstName, 
        lastName 
      });

      // Assuming the API returns the user ID in the response
      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId); // Store user ID here
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="border p-2 mb-2 w-full"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="border p-2 mb-2 w-full"
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="border p-2 mb-2 w-full"
        />
        <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 w-full mb-4">
          Register
        </button>
        <div className="text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;