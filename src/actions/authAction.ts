// src/actions/authAction.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
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
const LOGIN_ENDPOINT = `${API_BASE_URL}/api/v1/login`;

// Login Action
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(LOGIN_ENDPOINT, { email, password },{withCredentials: true});
      
      // if (response.data.success) {
      //   // Store the complete user object including the token
      //   localStorage.setItem('userInfo', JSON.stringify(response.data.user));
      //   localStorage.setItem('token', response.data.user.token);
      // }
      return response.data.user;  
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Network error occurred');
    }
  }
);

// Logout Action
export const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('token');
  return { type: 'auth/logout' };  // Simple action to handle logout in the reducer
};

// Get User Info Action
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// Get User Role Action
export const getUserRole = () => {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.role : null;
};
