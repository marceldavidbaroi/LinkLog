import axios from "axios";
import type { LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);
export const loginUser = async (payload: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/signin`, payload);
  return response.data;
};

export const signupUser = async (payload: {
  username: string;
  password: string;
}): Promise<void> => {
  const response = await axios.post(`${API_URL}/signup`, payload);
  return response.data;
};
