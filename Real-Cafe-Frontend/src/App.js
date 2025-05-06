import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';

import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';

// ROUTES 
import KasirRoute from './components/ProtectedRoute-kasir';
import DapurRoute from './components/ProtectedRoute-dapur';
import AdminRoute from './components/ProtectedRoute-admin';
import { AuthProvider } from './contexts/AuthContext';

// ADMIN
import Admin from './Pages/Admin/Admin';
import Sale_Revenue from './Pages/Admin/Sale_Revenue';
import AllTime from './Pages/Admin/AllTime';
import Traffic from './Pages/Admin/Traffic';
import MenuFotoEdit from './Pages/Admin/MenuFotoEdit';

// EMPLOYEE
import OrderForm from './Pages/Employee/OrderForm';

import DapurOption from './Pages/Employee/DapurOption';
import OrderSummary from './Pages/Employee/OrderSummary';
import OrderSummaryFood from './Pages/Employee/OrderSummaryFood';
import OrderSummaryDrink from './Pages/Employee/OrderSummaryDrink';

import Stock from './Pages/Employee/Stock';
import Pengeluaran from './Pages/Employee/Pengeluaran';
import Summary from './Pages/Employee/Summary';
import Shift from './Pages/Employee/Shift';
import Expense from './Pages/Employee/Expense';
import ShoppingList from './Pages/Employee/ShoppingList';

// Customers
import MenuFoto from './Pages/Employee/MenuFoto';

import Layout from './components/Layout';



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
          {/* Admin Route */}
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
              <AdminRoute element={<Layout><MenuFotoEdit /></Layout>} />
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
            path="/DapurOption"
            element={
              <DapurRoute element={<Layout><DapurOption /></Layout>} />
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
          <Route
            path="/shopping-list"
            element={
              <DapurRoute element={<Layout><ShoppingList /></Layout>} />
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
