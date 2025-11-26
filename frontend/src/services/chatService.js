// frontend/src/services/chatService.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: `${BASE_URL}/chat`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  getUsers: () => api.get("/users"),
  getMessagesWithUser: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (receiverId, text) => api.post("/messages", { receiverId, text }),
};
