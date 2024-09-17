import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  // Function to scroll to the top
  const scrollToTop = () => {
    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav className={`navbar ${isOpen ? "open" : "closed"}`}>
        <button className="close-button" onClick={toggleNavbar}>
          <img src="/icons/navbar.svg" alt="Nav" />
        </button>

        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
            <h3>Real Cafe</h3>
          </Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/order-form">
              <img src="/icons/point-sale-bill.svg" alt="Cashier" />
              Cashier
            </Link>
          </li>
          <li>
            <Link to="/order-summary">
              <img src="/icons/order-kitchen.svg" alt="Kitchen Order" />
              Kitchen
            </Link>
          </li>
          <li>
            <Link to="/login">
              <img src="/icons/login.svg" alt="login" className="login-icon" />
              Login
            </Link>
          </li>
        </ul>
      </nav>
      <button
        className={`reopen ${isOpen ? "open" : "closed"}`}
        onClick={() => {
          toggleNavbar(); // Toggle the navbar
          scrollToTop(); // Scroll to the top of the screen
        }}
      >
        <img src="/icons/navbar.svg" alt="Nav" />
      </button>
    </>
  );
};

export default Navbar;
