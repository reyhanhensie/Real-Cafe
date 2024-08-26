import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderForm from './OrderForm'; // Your Order Form component
import OrderSummary from './OrderSummary'; // Your Order Summary component
import Home from './pages/Home';
import Contact from './pages/Contact';
import './App.css'; // Import global CSS file

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/order-form', '/order-summary'];

  return (
    <div className="app">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order-form" element={<OrderForm />} />
          <Route path="/order-summary" element={<OrderSummary />} />
        </Routes>
      </main>
      <Footer className="footer" />
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
