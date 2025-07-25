import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const apiRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
});

export default apiRequest;
