import axios from "axios";

const api = axios.create({
  baseURL: 'https://datagaze-sandbox-b8e288ff5051.herokuapp.com/api', 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
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
