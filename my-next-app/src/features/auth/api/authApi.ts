import api from "@/lib/axios";
import type { LoginResponse } from "../types/auth";
import type { ApiResponse } from "@/types/api-response.type";

export const loginUser = async (payload: {
  username: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/signin",
    payload,
    { withCredentials: true }
  );
  return response.data;
};

export const signupUser = async (payload: {
  username: string;
  password: string;
}): Promise<ApiResponse<LoginResponse>> => {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/signup",
    payload,
    { withCredentials: true }
  );
  return response.data;
};
