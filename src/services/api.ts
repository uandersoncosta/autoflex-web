import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/autoflex/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", message);
    return Promise.reject(error);
  },
);

export default api;
