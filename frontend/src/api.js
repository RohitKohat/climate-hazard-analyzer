import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyze(payload) {
  const { data } = await axios.post(`${API}/api/analyze`, payload);
  return data;
}