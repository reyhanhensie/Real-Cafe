// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import Register from './pages/Auth/Register'; // Import Register component
import Login from './pages/Auth/Login'; // Import Register component
import Layout from './components/Layout'; // Import Layout component

import './App.css'; // Import global CSS file

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/order-form" element={<Layout><OrderForm /></Layout>} />
      <Route path="/order-summary" element={<Layout><OrderSummary /></Layout>} />
      <Route path="/register" element={<Register />} /> {/* No Layout for Register */}
      <Route path="/login" element={<Login />} /> {/* No Layout for Register */}
    </Routes>
  </Router>
);

export default App;
