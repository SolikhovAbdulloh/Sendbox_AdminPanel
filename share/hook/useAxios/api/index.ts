import { getApiUrl } from "@/lib/api-config";
import { getToken } from "@/share/utils/auth";
import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: "http://192.168.1.112:4000/api",
=======
  baseURL: getApiUrl('api'),
>>>>>>> f8d036b7b35cd4a58ad5afc2c93c5f5bbb38b79b
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log(
        "Token yaroqsiz yoki muddati tugagan. Foydalanuvchini logout qilamiz.",
        error
      );
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
