import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/images/logo.png';
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
      <img src={logo} alt="Logo" />
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/order-form">Cashier</Link></li>
        <li><Link to="/order-summary">Kitchen Order</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
