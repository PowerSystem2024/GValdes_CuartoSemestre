import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:3333";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});
