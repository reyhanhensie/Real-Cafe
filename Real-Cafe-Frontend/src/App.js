// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import Register from './pages/Auth/Register';
import Secret from './pages/Secret/Secret';
import Login from './pages/Auth/Login';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthWrapper from './components/AuthWrapper'; // Import the AuthWrapper component
import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AuthWrapper> {/* Wrap Routes in AuthWrapper */}
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/order-form" element={<OrderForm />} /> {/* No Layout */}
            <Route path="/order-summary" element={<OrderSummary />} /> {/* No Layout */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/secret" element={<ProtectedRoute element={<Secret />} />} /> {/* Protect Secret route */}
          </Routes>
        </AuthWrapper>
      </AuthProvider>
    </Router>
  );
};

export default App;
