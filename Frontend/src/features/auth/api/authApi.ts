import api from "../../../api/axios";
import type { LoginResponse, SignupResponse } from "../types/auth";

export const loginUser = async (payload: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/signin", payload);
  return data;
};

export const signupUser = async (payload: {
  username: string;
  password: string;
}): Promise<SignupResponse> => {
  const { data } = await api.post<SignupResponse>("/auth/signup", payload);
  return data;
};
