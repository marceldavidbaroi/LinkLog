import api from "../../../api/axios";
import type { LoginResponse } from "../types/auth";

export const loginUser = async (payload: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/signin", payload, {
    withCredentials: true, // ensures refresh token cookie is sent
  });
  console.log(response);

  return response;
};

export const signupUser = async (payload: {
  username: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/signup", payload, {
    withCredentials: true,
  });
  console.log(response);
  return response;
};
