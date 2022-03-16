import { configureStore } from '@reduxjs/toolkit'

import weatherReducer from './slices/weatherSlice'

export function makeStore() {
  return configureStore({
    reducer: {
      weather: weatherReducer
    },
    devTools: true
  })
}

const store = makeStore()

export default store
