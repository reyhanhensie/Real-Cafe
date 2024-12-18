// src/apiConfig.js
let API_URL;

if (process.env.NODE_ENV === "development") {
  API_URL = "http://192.168.100.100/api"; // Local development API
} else {
  API_URL = "/api"; // Production API (relative path)
}

export default API_URL;
