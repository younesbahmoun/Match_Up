import axios from "axios";

import type { LoginData, LoginResponse } from "../types/authTypes";

const AUTH_BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

export async function loginRequest(data: LoginData): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(`${AUTH_BASE_URL}/login`, data);
  return response.data;
}