import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const createOrder = createAsyncThunk('orders/create', async (data, { rejectWithValue }) => {
  try {
    const res = await orderService.create(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Order failed');
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await orderService.getMyOrders();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

export const fetchDealerOrders = createAsyncThunk('orders/fetchDealer', async (_, { rejectWithValue }) => {
  try {
    const res = await orderService.getDealerOrders();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try {
    const res = await orderService.updateStatus(id, status);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { orders: [], loading: false, error: null },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchDealerOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchDealerOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchDealerOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      });
  },
});

export const { clearError } = orderSlice.actions;
export default orderSlice.reducer;
