import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateFollowUp } from "./assistantService.js";

export const generateMessage = createAsyncThunk(
  "assistant/generate",
  async (input, { rejectWithValue }) => {
    try {
      return await generateFollowUp(input);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);

const initialState = {
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  message: "",
  error: null,
};

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    updateDraft: (s, a) => {
      s.message = a.payload;
    },
    resetAssistant: () => initialState,
  },
  extraReducers: (b) => {
    b.addCase(generateMessage.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(generateMessage.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.message = a.payload;
      })
      .addCase(generateMessage.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || a.error.message || "Failed to generate message";
      });
  },
});

export const { updateDraft, resetAssistant } = assistantSlice.actions;
export default assistantSlice.reducer;
