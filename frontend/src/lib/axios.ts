import axios from "axios";

export const api = axios.create({
  baseURL: "https://wzch2937-3000.euw.devtunnels.ms/",
  headers: { "Content-Type": "application/json" },
});
