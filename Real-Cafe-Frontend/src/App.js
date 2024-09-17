// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import Register from './pages/Auth/Register';
import Secret from './pages/Secret/Secret';
import Login from './pages/Auth/Login';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {

  return (
    <Router>
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/order-form" element={<Layout><OrderForm /></Layout>} /> {/* No Layout */}
            <Route path="/order-summary" element={<Layout><OrderSummary /></Layout>} /> {/* No Layout */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Layout><Login /></Layout>} />
            <Route path="/secret" element={<ProtectedRoute element={<Secret />} />} /> {/* Protect Secret route */}
          </Routes>
      </AuthProvider> 
    </Router>
  );
};

export default App;
