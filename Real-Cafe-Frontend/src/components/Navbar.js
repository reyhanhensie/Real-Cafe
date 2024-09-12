import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/">
          <img src="/icons/home.svg" alt="Home" />
          Home
          </Link>
        </li>
        <li>
          <Link to="/order-form">
            <img src="/icons/point-sale-bill.svg" alt="Cashier" />
            Cashier
          </Link>
        </li>
        <li>
          <Link to="/order-summary">
          <img src="/icons/order-kitchen.svg" alt="Kitchen Order" />
          Kitchen</Link>
        </li>
        <li>
          <Link to="/login">
            <img src="/icons/login.svg" alt="login" className="login-icon" />
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
