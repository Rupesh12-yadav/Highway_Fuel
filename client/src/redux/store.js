import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import pumpReducer from './slices/pumpSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    pumps: pumpReducer,
    user: userReducer,
  },
});
