import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 5000,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // interceptor.js
        const { data } = await api.post("/auth/refresh");
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        window.dispatchEvent(
          new CustomEvent("tokenRefreshed", { detail: data.accessToken })
        );
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
