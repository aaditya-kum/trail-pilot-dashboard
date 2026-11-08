import { configureStore } from "@reduxjs/toolkit";
import leadsReducer from "../features/leads/leadsSlice.js";
import packagesReducer from "../features/packages/packagesSlice.js";

export const store = configureStore({
  reducer: {
    leads: leadsReducer,
    packages: packagesReducer,
  },
});
