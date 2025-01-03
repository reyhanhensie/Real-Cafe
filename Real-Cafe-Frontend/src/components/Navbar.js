import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Cookies from "js-cookie";
import axios from "axios";
import URL_API from "../apiconfig";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { userRole } = useContext(AuthContext); // Access userRole from context
  const token = Cookies.get("token"); // Get the token from cookies
  const Authority =
    userRole === "kasir"
      ? 1
      : userRole === "dapur"
      ? 2
      : userRole === "admin"
      ? 3
      : null;

  const logoutHandler = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // Send a request to log the user out
    await axios.post(`${URL_API}/logout`).then(() => {
      // Remove the token and reset user role
      Cookies.remove("token");
      // setAuthority(null); // Reset authority on logout
      navigate("/");
    });
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

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
          {!token ? ( // Show login if the token is not present
            <li>
              <Link to="/login">
                <img
                  src="/icons/login.svg"
                  alt="login"
                  className="login-icon"
                />
                Login
              </Link>
            </li>
          ) : (
            <>
              {Authority >= 3 && (
                <li>
                  <Link to="/finance">
                    <img src="/icons/finance.svg" alt="Kitchen Order" />
                    Finance
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/stock-management">
                    <img src="/icons/stock.svg" alt="Stock" />
                    Stock
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/order-summary-drink">
                    <img src="/icons/minuman.svg" alt="Kitchen Order" />
                    Dapur Minum
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/order-summary-food">
                    <img src="/icons/food.svg" alt="Kitchen Order" />
                    Dapur Makan
                  </Link>
                </li>
              )}

              {Authority >= 1 && (
                <li>
                  <Link to="/order-summary">
                    <img src="/icons/order-kitchen.svg" alt="Kitchen Order" />
                    Dapur
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/Shift">
                    <img src="/icons/bill.svg" alt="Summary" />
                    Laporan
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/spending">
                    <img src="/icons/spend.svg" alt="Pengeluaran" />
                    Pengeluaran
                  </Link>
                </li>
              )}
              {Authority >= 1 && (
                <li>
                  <Link to="/order-form">
                    <img src="/icons/point-sale-bill.svg" alt="Cashier" />
                    Kasir
                  </Link>
                </li>
              )}
              <li>
                <Link to="/" onClick={logoutHandler}>
                  <img
                    src="/icons/logout.svg"
                    alt="logout"
                    className="logout-icon"
                  />
                  Logout
                </Link>
              </li>
            </>
          )}
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
