import axios from "axios";

const apiRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

export default apiRequest;
