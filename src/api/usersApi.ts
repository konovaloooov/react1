import axiosInstance from './axiosInstance';
import { User } from '../types/shop';

export const getMeRequest = (): Promise<User> =>
  axiosInstance.get<User>('/users/me').then((response) => response.data);
