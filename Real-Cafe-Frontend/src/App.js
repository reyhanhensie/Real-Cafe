// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import Register from './pages/Auth/Register'; // Import Register component
import Secret from './pages/Secret/Secret'; // Import Register component
import Login from './pages/Auth/Login'; // Import Register component
import Layout from './components/Layout'; // Import Layout component
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Import global CSS file

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/order-form" element={<Layout><OrderForm /></Layout>} />
        <Route path="/order-summary" element={<Layout><OrderSummary /></Layout>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/secret" element={<ProtectedRoute element={<Secret />} />} /> {/* Protect Secret route */}

      </Routes>
    </AuthProvider>
  </Router>
);

export default App;
