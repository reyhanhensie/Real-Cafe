import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';

// ROUTES 
import KasirRoute from './components/ProtectedRoute-kasir';
import DapurRoute from './components/ProtectedRoute-dapur';
import AdminRoute from './components/ProtectedRoute-admin';

// ADMIN
import Admin from './Pages/Admin/Admin';

import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';
import OrderSummaryFood from './OrderSummaryFood';
import OrderSummaryDrink from './OrderSummaryDrink';
import Stock from './Stock';
import Sale_Revenue from './Pages/Admin/Sale_Revenue';
import AllTime from './Pages/Admin/AllTime';
import Traffic from './Pages/Admin/Traffic';
import Pengeluaran from './Pengeluaran';
import Summary from './Summary';
import Shift from './Shift';
import Expense from './Expense';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';


import MenuFoto from './MenuFoto';
import MenuFotoEdit from './Pages/Admin/MenuFotoEdit';

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
          <Route path="/MenuFoto" element={<MenuFoto />} />


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
            path="/admin"
            element={
              <AdminRoute element={<Layout><Admin /></Layout>} />
            }
          />
          <Route
            path="/sale-revenue"
            element={
              <AdminRoute element={<Layout><Sale_Revenue /></Layout>} />
            }
          />
          <Route
            path="/All-Time"
            element={
              <AdminRoute element={<Layout><AllTime /></Layout>} />
            }
          />
          <Route
            path="/traffic"
            element={
              <AdminRoute element={<Layout><Traffic /></Layout>} />
            }
          />
          <Route
            path="/MenuFotoEdit"
            element={
              <AdminRoute element={<Layout><MenuFotoEdit/></Layout>} />
            }
          />
          <Route
            path="/shift"
            element={
              <DapurRoute element={<Layout><Shift /></Layout>} />
            }
          />
          <Route
            path="/expense"
            element={
              <DapurRoute element={<Layout><Expense /></Layout>} />
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
