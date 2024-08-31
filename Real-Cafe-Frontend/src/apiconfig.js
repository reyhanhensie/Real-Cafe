// src/apiConfig.js
let API_URL;

if (process.env.NODE_ENV === 'development') {
    API_URL = 'http://127.0.0.1:8000/api'; // Local development API
} else {
    API_URL = 'http://192.168.1.3/api'; // Production API (relative path)
}

export default API_URL;
