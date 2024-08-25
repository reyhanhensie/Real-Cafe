import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderForm from './OrderForm'; // Your Order Form component
import OrderSummary from './OrderSummary'; // Your Order Summary component
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/order-form" element={<OrderForm />} />
            <Route path="/order-summary" element={<OrderSummary />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
