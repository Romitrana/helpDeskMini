import axios from "axios";

// Axios instance
const API = axios.create({
  //   baseURL: "http://localhost:5000/api",
  baseURL: "https://helpdeskmini-celn.onrender.com/api",
});

// Attach JWT token automatically to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
