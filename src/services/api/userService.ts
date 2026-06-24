import axiosInstance from '@/services/api/axiosInstance';

interface LoginResponse {
  token: string;
  user: IUser;
  expiresAt: number;
}

/**
 * Sends a login request to the mock server and returns user, token, and expiration timestamp.
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> =>
  axiosInstance
    .post<LoginResponse>('/users/login', {
      email,
      password,
    })
    .then(res => res?.data);
