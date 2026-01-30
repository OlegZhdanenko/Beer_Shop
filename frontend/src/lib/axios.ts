import axios from "axios";
import { authStorage } from "./authStorage";

export const api = axios.create({
  baseURL: "https://wzch2937-3000.euw.devtunnels.ms/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authStorage.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.post("/auth/refresh", {
          refreshToken: authStorage.refresh,
        });

        authStorage.set(data.accessToken, data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (e) {
        authStorage.clear();
        window.location.reload();
      }
    }

    return Promise.reject(error);
  },
);
