import axiosInstance from './axiosInstance';
import { AuthResponse, LoginData, RegisterData } from '../types/shop';

export const loginRequest = (data: LoginData): Promise<AuthResponse> =>
  axiosInstance.post<AuthResponse>('/auth/login', data).then((response) => response.data);

export const registerRequest = (data: RegisterData): Promise<AuthResponse> =>
  axiosInstance.post<AuthResponse>('/auth/register', data).then((response) => response.data);
