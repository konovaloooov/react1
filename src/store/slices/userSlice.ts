import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginRequest, registerRequest } from '../../api/authApi';
import { getMeRequest } from '../../api/usersApi';
import type { AppThunk } from '..';
import { LoginData, RegisterData, User } from '../../types/shop';
import { getErrorMessage } from '../../utils/getErrorMessage';
import { getToken, removeToken, setToken } from '../../utils/tokenStorage';
import { showError } from './errorSlice';
import { setLoading } from './loadingSlice';

interface UserState {
  currentUser: User | null;
  isAuth: boolean;
  isInitialized: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuth: false,
  isInitialized: !getToken(),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.isAuth = true;
      state.isInitialized = true;
    },
    logout(state) {
      state.currentUser = null;
      state.isAuth = false;
      state.isInitialized = true;
      removeToken();
    },
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
});

export const { setUser, logout, setInitialized } = userSlice.actions;

export const login = (data: LoginData): AppThunk<Promise<User | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await loginRequest({ email: data.email.trim(), password: data.password.trim() });
    setToken(response.access_token);
    dispatch(setUser(response.user));
    return response.user;
  } catch (error) {
    dispatch(setInitialized());
    dispatch(showError(getErrorMessage(error, 'Ошибка авторизации')));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const register = (data: RegisterData): AppThunk<Promise<User | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await registerRequest(data);
    setToken(response.access_token);
    dispatch(setUser(response.user));
    return response.user;
  } catch (error) {
    dispatch(setInitialized());
    dispatch(showError(getErrorMessage(error, 'Ошибка регистрации')));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchMe = (): AppThunk<Promise<User | null>> => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const user = await getMeRequest();
    dispatch(setUser(user));
    return user;
  } catch {
    dispatch(logout());
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export default userSlice.reducer;
