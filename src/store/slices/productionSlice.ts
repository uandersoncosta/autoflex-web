import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProductionSuggestion, ProductionSuggestionItem } from "@/types";
import { productionApi } from "@/services/productionApi";

interface ProductionState {
  suggestions: ProductionSuggestionItem[];
  totalRevenue: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductionState = {
  suggestions: [],
  totalRevenue: 0,
  loading: false,
  error: null,
};

// Async thunk
export const fetchProductionSuggestion = createAsyncThunk(
  "production/fetchSuggestion",
  async () => {
    return await productionApi.getProductionSuggestion();
  },
);

const productionSlice = createSlice({
  name: "production",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductionSuggestion.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductionSuggestion.fulfilled, (state, action) => {
      state.loading = false;
      state.suggestions = action.payload.products;
      state.totalRevenue = action.payload.totalValue;
    });
    builder.addCase(fetchProductionSuggestion.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to fetch production suggestion";
    });
  },
});

export const { clearError } = productionSlice.actions;
export default productionSlice.reducer;
