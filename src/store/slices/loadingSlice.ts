import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
  activeRequests: number;
}

const initialState: LoadingState = {
  isLoading: false,
  activeRequests: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.activeRequests = action.payload
        ? state.activeRequests + 1
        : Math.max(0, state.activeRequests - 1);
      state.isLoading = state.activeRequests > 0;
    },
  },
});

export const { setLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
