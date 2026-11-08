import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchPackages = createAsyncThunk(
  "packages/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/packages");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addPackage = createAsyncThunk(
  "packages/add",
  async (travelPackage, { rejectWithValue }) => {
    try {
      const response = await api.post("/packages", travelPackage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updatePackage = createAsyncThunk(
  "packages/update",
  async (travelPackage, { rejectWithValue }) => {
    try {
      const id = travelPackage.id ?? travelPackage._id;
      const response = await api.put(`/packages/${id}`, travelPackage);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const deletePackage = createAsyncThunk(
  "packages/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/packages/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const packagesSlice = createSlice({
  name: "packages",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload)
          ? action.payload
          : Array.isArray(action.payload?.data)
            ? action.payload.data
            : [];
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        const createdPackage = action.payload?.data ?? action.payload;
        if (createdPackage) state.items.push(createdPackage);
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        const updatedPackage = action.payload?.data ?? action.payload;
        const id = updatedPackage?.id ?? updatedPackage?._id;
        const index = state.items.findIndex(
          (item) => (item.id ?? item._id) === id,
        );
        if (index !== -1) state.items[index] = updatedPackage;
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => (item.id ?? item._id) !== action.payload,
        );
      });
  },
});

export default packagesSlice.reducer;
