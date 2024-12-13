import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import OrderSummaryFood from './OrderSummaryFood';
import OrderSummaryDrink from './OrderSummaryDrink';
import Stock from './Stock';
import Finance from './Finance';
import Pengeluaran from './Pengeluaran';
import Summary from './Summary';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import KasirRoute from './components/ProtectedRoute-kasir';
import DapurRoute from './components/ProtectedRoute-dapur';
import AdminRoute from './components/ProtectedRoute-admin';

import './App.css';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          
          {/* Protected Routes */}
          <Route 
            path="/order-form" 
            element={
              <KasirRoute element={<Layout><OrderForm /></Layout>} />
            } 
          />
          <Route 
            path="/order-summary" 
            element={
              <DapurRoute element={<Layout><OrderSummary /></Layout>} />
            } 
          />
          <Route 
            path="/stock-management" 
            element={
              <DapurRoute element={<Layout><Stock /></Layout>} />
            } 
          />
            <Route 
            path="/spending" 
            element={
              <DapurRoute element={<Layout><Pengeluaran /></Layout>} />
            } 
          />
            <Route 
            path="/summary" 
            element={
              <DapurRoute element={<Layout><Summary /></Layout>} />
            } 
          />
            <Route 
            path="/order-summary-food" 
            element={
              <DapurRoute element={<Layout><OrderSummaryFood /></Layout>} />
            } 
          />
            <Route 
            path="/order-summary-drink" 
            element={
              <DapurRoute element={<Layout><OrderSummaryDrink /></Layout>} />
            } 
          />
               <Route 
            path="/finance" 
            element={
              <DapurRoute element={<Layout><Finance/></Layout>} />
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
