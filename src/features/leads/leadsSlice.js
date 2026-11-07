import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchLeads = createAsyncThunk(
  "leads/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.get("/leads")).data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const addLead = createAsyncThunk(
  "leads/add",
  async (lead, { rejectWithValue }) => {
    try {
      return (await api.post("/leads", lead)).data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const updateLead = createAsyncThunk(
  "leads/update",
  async (lead, { rejectWithValue }) => {
    try {
      return (await api.put(`/leads/${lead.id}`, lead)).data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const deleteLead = createAsyncThunk(
  "leads/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const leadsSlice = createSlice({
  name: "leads",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchLeads.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchLeads.fulfilled, (s, a) => {
        s.loading = false;
        s.items = Array.isArray(a.payload)
          ? a.payload
          : Array.isArray(a.payload?.data)
            ? a.payload.data
            : [];
      })
      .addCase(fetchLeads.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(addLead.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateLead.fulfilled, (s, a) => {
        const i = s.items.findIndex((l) => l.id === a.payload.id);
        if (i !== -1) s.items[i] = a.payload;
      })
      .addCase(deleteLead.fulfilled, (s, a) => {
        s.items = s.items.filter((l) => l.id !== a.payload);
      });
  },
});

export default leadsSlice.reducer;
