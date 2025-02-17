import { createAction, createSlice } from '@reduxjs/toolkit';
import { login, logout } from '../actions/authAction';

interface AuthState {
  user: null | {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
  isAuthenticated: boolean;
  error: null | string;
}

// Get user data from localStorage if it exists
const storedUser = localStorage.getItem('userInfo');

const initialState: AuthState = storedUser
  ? {
      user: JSON.parse(storedUser),
      isAuthenticated: true,
      error: null,
    }
  : {
      user: null,
      isAuthenticated: false,
      error: null,
    };

export const logoutAction = createAction('auth/logout');

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;

        // Persist user data in localStorage
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })  
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logoutAction, (state) => {
        state.user = null;
        state.isAuthenticated = false;

        // Remove user data from localStorage on logout
        localStorage.removeItem('userInfo');
      });
  },
});

export default authSlice.reducer;
