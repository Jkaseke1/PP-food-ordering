import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import PrintList from './pages/PrintList';
import FinancialStatements from './pages/FinancialStatements';
import SendOrders from './pages/SendOrders'; // Import SendOrders component
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { isAdmin } from './utils/auth';
import './index.css'; // Import Tailwind CSS

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
        <Route path="/admin" element={isAdmin() ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/print-list" element={isAdmin() ? <PrintList /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/financial-statements" element={isAdmin() ? <FinancialStatements /> : <Navigate to="/dashboard" />} />
        <Route path="/admin/send-orders" element={isAdmin() ? <SendOrders /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
};

export default App;