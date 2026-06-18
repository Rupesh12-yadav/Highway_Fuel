import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pumpService } from '../../services/pumpService';

export const fetchPumps = createAsyncThunk('pumps/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await pumpService.getAll(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

export const fetchPumpById = createAsyncThunk('pumps/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await pumpService.getById(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

export const fetchMyPumps = createAsyncThunk('pumps/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await pumpService.getMyPumps();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Fetch failed');
  }
});

const pumpSlice = createSlice({
  name: 'pumps',
  initialState: { pumps: [], selectedPump: null, myPumps: [], loading: false, error: null, total: 0 },
  reducers: { clearError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPumps.pending, (state) => { state.loading = true; })
      .addCase(fetchPumps.fulfilled, (state, action) => { state.loading = false; state.pumps = action.payload.pumps; state.total = action.payload.total; })
      .addCase(fetchPumps.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchPumpById.fulfilled, (state, action) => { state.selectedPump = action.payload; })
      .addCase(fetchMyPumps.fulfilled, (state, action) => { state.myPumps = action.payload; });
  },
});

export const { clearError } = pumpSlice.actions;
export default pumpSlice.reducer;
