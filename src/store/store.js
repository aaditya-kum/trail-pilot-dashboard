import { configureStore } from '@reduxjs/toolkit'
import leadsReducer from '../features/leads/leadsSlice.js'

const appReducer = (state = {}) => state

export const store = configureStore({
  reducer: {
    app: appReducer,
    leads: leadsReducer,
  },
})

export const dispatch = store.dispatch
