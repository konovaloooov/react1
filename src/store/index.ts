import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import errorReducer from './slices/errorSlice';
import loadingReducer from './slices/loadingSlice';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  loading: loadingReducer,
  error: errorReducer,
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => ReturnType;
