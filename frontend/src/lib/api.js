// frontend/src/lib/api.js
import { axiosInstance } from "./axios.js";

export async function getStreamToken() {
  // Requests: BASE_URL + "/chat/token" -> https://.../api/chat/token
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}