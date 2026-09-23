import axios from "axios";

const API = axios.create({
  baseURL: "https://jobfinder-pro.onrender.com/api",

  headers: {
    "Content-Type": "application/json"
  }
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jobfinder_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jobfinder_token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default API;