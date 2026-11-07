import { configureStore } from '@reduxjs/toolkit'

const appReducer = (state = {}) => state

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
})

export const dispatch = store.dispatch
