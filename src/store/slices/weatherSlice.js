import { createSlice } from '@reduxjs/toolkit'

const zipCodeSchema = {
  zip: '',
  isValid: false,
  alreadyExists: false,
  weather: null,
  requestTimestamp: 0
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    zipCodes: [],
    waitingAPI: false,
    currentZipTabIndex: -1,
    cityNotFound: false
  },
  reducers: {
    addZipCode: (state) => {
      state.zipCodes.push({ ...zipCodeSchema })
    },
    setZipCode: (state, action) => {
      state.zipCodes[action.payload.index] = action.payload.zipCode
    },
    removeZipCode: (state, action) => {
      state.zipCodes.splice(action.payload, 1)
    },
    setWaitingAPI: (state, action) => {
      state.waitingAPI = action.payload
    },
    setWeather: (state, action) => {
      state.zipCodes[action.payload.index].weather = action.payload.weather
    },
    setRequestTimestamp: (state, action) => {
      state.zipCodes[action.payload.index].requestTimestamp = action.payload.timestamp
    },
    setCurrentTZipTabIndex: (state, action) => {
      state.currentZipTabIndex = action.payload
    },
    setCityNotFound: (state, action) => {
      state.cityNotFound = action.payload
    },
  },
})

export const {
  addZipCode,
  setZipCode,
  removeZipCode,
  setWaitingAPI,
  setWeather,
  setRequestTimestamp,
  setCurrentTZipTabIndex,
  setCityNotFound
} = weatherSlice.actions

export const selectZipCodes = (state) => state.weather.zipCodes
export const selectWaitingAPI = (state) => state.weather.waitingAPI
export const selectCurrentTZipTabIndex = (state) => state.weather.currentZipTabIndex
export const selectCityNotFound = (state) => state.weather.cityNotFound


export default weatherSlice.reducer