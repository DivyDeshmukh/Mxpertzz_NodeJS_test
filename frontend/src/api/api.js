import axios from "axios";

const api = axios.create({
  baseURL: "https://placement-cell-full-stack.vercel.app/api/v1",
  withCredentials: true,
});

export default api;
