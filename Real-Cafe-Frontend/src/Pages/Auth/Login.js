// src/pages/Auth/Login.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import URL_API from "../../apiconfig"; // Updated import path
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Get the CSRF token from the meta tag after the component mounts
    const token = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content");
    setCsrfToken(token || "");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${URL_API}/login`,
        {
          username,
          password,
        },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      setIsAuthenticated(true);
      // Assuming the token is in the 'access_token' field
      const { access_token } = response.data;

      if (!access_token) {
        throw new Error("No token received from server");
      }

      // Save token in localStorage
      localStorage.setItem("authToken", access_token);

      setError("");
      navigate("/secret");
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.error || "An unexpected error occurred.");
      setMessage("");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
