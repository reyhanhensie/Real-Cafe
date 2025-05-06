import React, { useContext,useState, useEffect } from "react";
import axios from "axios";
import URL_API from "../../apiconfig"; // Updated import path
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Cookies from "js-cookie";
import { AuthContext } from "../../contexts/AuthContext";
import "./Login.css"; // Import the new CSS file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

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
            "Content-Type": "application/json",
          },
        }
      );
      //set token on cookies
      localStorage.set("token", response.data.token);
      localStorage.set("role",response.data.user.role)
      console.log("Login response:", response.data);
      setIsAuthenticated(true);

      navigate("/");
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      setError(err.response?.data?.message || "An unexpected error occurred.");
      setMessage("");
    }
  };

  return (
    <div className="login-container">
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
