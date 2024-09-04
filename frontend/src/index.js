import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import './index.css'; // Tailwind CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
    <ToastContainer /> {/* Render ToastContainer inside Provider */}
  </Provider>
);