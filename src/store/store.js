import { configureStore } from '@reduxjs/toolkit'
import leadsReducer from '../features/leads/leadsSlice.js'
import packagesReducer from '../features/packages/packagesSlice.js'

const appReducer = (state = {}) => state

export const store = configureStore({
  reducer: {
    app: appReducer,
    leads: leadsReducer,
    packages: packagesReducer,
  },
})

export const dispatch = store.dispatch
