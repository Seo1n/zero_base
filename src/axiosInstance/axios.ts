import axios, { type AxiosRequestConfig } from 'axios';
import { type User } from '../components/types/types';

import { baseUrl } from './constants';

export function getJWTHeader(
  token: User['accessToken'],
): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

const config: AxiosRequestConfig = { baseURL: baseUrl, withCredentials: true };
export const axiosInstance = axios.create(config);
