import axios from "axios";

const api = axios.create({
  baseURL: "https://jobfinder-pro.onrender.com",

  headers: {
    "Content-Type": "application/json"
  }
});


// =========================
// ADD JWT TOKEN
// =========================

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem("jobfinder_token");

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);


// =========================
// HANDLE UNAUTHORIZED
// =========================

api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem(
        "jobfinder_token"
      );

      localStorage.removeItem(
        "user"
      );
    }

    return Promise.reject(error);
  }
);


export default api;