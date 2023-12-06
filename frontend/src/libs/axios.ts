import axios from "axios";
import { AuthStore } from "@/stores/AuthStore";
import { router } from "@/routes/router";

const authStore = AuthStore();

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  if (authStore.token) {
    config.headers.token = authStore.token;
  }
  return config;
});
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      authStore.logout();
      router.push({ name: "login" });
    }
    return Promise.reject(error);
  }
);

export default instance;
