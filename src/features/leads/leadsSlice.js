import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchLeads = createAsyncThunk(
  "leads/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/leads");
      return response.data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const addLead = createAsyncThunk(
  "leads/add",
  async (lead, { rejectWithValue }) => {
    try {
      const response = await api.post("/leads", lead);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

export const updateLead = createAsyncThunk(
  "leads/update",
  async (lead, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/${lead.id}`, lead);
      return response.data;
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
        s.items = a.payload;
      })
      .addCase(fetchLeads.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(addLead.fulfilled, (s, a) => {
        s.items.push(a.payload);
      })
      .addCase(updateLead.fulfilled, (s, a) => {
        const updatedLead = a.payload;
        const leadId = updatedLead.id;
        const i = s.items.findIndex((l) => l.id === leadId);
        if (i !== -1) {
          s.items[i] = updatedLead;
        }
      })
      .addCase(deleteLead.fulfilled, (s, a) => {
        s.items = s.items.filter((lead) => lead.id !== a.payload);
      });
  },
});

export default leadsSlice.reducer;
