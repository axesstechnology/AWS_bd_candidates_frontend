// src/services/authService.ts
import axios from 'axios';

interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL as string;
// const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/login`; // Changed from register to login
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/login`
const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(LOGIN_ENDPOINT, {
        email,
        password,
      });

      if (response.data.success) {
        // Store the complete user object including the token
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        // Store token separately if needed
        localStorage.setItem('token', response.data.user.token);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  getUserRole: () => {
    const userInfo = authService.getUserInfo();
    return userInfo ? userInfo.role : null;
  }
};

export default authService;
