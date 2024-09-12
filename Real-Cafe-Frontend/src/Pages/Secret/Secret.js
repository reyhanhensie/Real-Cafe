// src/pages/Secret/Secret.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import URL_API from "../../apiconfig";

const Secret = () => {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const logoutHandler = async () => {
    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //fetch Rest API
    await axios
      .post(`${URL_API}/logout`)
      .then(() => {
        //remove token from cookies
        Cookies.remove("token");

        navigate("/login");
      });
  };
  // Redirect if loading or not authenticated


  // Optionally handle role-based access

  return (
    <div>
      <h2>Welcome, Admin</h2>
      <button onClick={(logoutHandler) }>Logout</button>
    </div>
  );
};

export default Secret;
