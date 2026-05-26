import axios from "axios";
import { getAppConfig } from "@/core/config/appConfig";

export const axiosClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const { apiBaseUrl } = getAppConfig();

  config.baseURL = apiBaseUrl;

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});