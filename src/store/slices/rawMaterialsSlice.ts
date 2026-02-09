import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RawMaterial, RawMaterialFormData } from "@/types";
import { rawMaterialsApi } from "@/services/rawMaterialsApi";

interface RawMaterialsState {
  items: RawMaterial[];
  selectedRawMaterial: RawMaterial | null;
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialsState = {
  items: [],
  selectedRawMaterial: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchRawMaterials = createAsyncThunk(
  "rawMaterials/fetchRawMaterials",
  async () => {
    return await rawMaterialsApi.getRawMaterials();
  },
);

export const createRawMaterial = createAsyncThunk(
  "rawMaterials/createRawMaterial",
  async (data: RawMaterialFormData) => {
    return await rawMaterialsApi.createRawMaterial(data);
  },
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/updateRawMaterial",
  async ({ id, data }: { id: string; data: RawMaterialFormData }) => {
    return await rawMaterialsApi.updateRawMaterial(id, data);
  },
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/deleteRawMaterial",
  async (id: string) => {
    await rawMaterialsApi.deleteRawMaterial(id);
    return id;
  },
);

const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {
    setSelectedRawMaterial: (
      state,
      action: PayloadAction<RawMaterial | null>,
    ) => {
      state.selectedRawMaterial = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch raw materials
    builder.addCase(fetchRawMaterials.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRawMaterials.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchRawMaterials.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch raw materials";
    });

    // Create raw material
    builder.addCase(createRawMaterial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRawMaterial.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    });
    builder.addCase(createRawMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to create raw material";
    });

    // Update raw material
    builder.addCase(updateRawMaterial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRawMaterial.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });
    builder.addCase(updateRawMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to update raw material";
    });

    // Delete raw material
    builder.addCase(deleteRawMaterial.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteRawMaterial.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((m) => m.id !== action.payload);
    });
    builder.addCase(deleteRawMaterial.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to delete raw material";
    });
  },
});

export const { setSelectedRawMaterial, clearError } = rawMaterialsSlice.actions;
export default rawMaterialsSlice.reducer;
