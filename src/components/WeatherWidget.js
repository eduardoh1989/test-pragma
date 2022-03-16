import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import styles from '../styles/weather-widget.module.scss'

import {
  selectZipCodes,
  selectCurrentTZipTabIndex,
  selectCityNotFound
} from '../store/slices/weatherSlice'

const WeatherWidget = () => {
  const currentTZipTabIndex = useSelector(selectCurrentTZipTabIndex)
  const zipCodes = useSelector(selectZipCodes)
  const cityNotFound = useSelector(selectCityNotFound)

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (currentTZipTabIndex < 0 || zipCodes[currentTZipTabIndex] == 'undefined') return setWeather(null)
    setWeather(zipCodes[currentTZipTabIndex].weather)
  }, [currentTZipTabIndex, zipCodes])

  return (
    <div className={styles['weather-widget']}>
      {cityNotFound ? <h2>City not found</h2> : <div className={styles['weather']}>
        {!weather || currentTZipTabIndex < 0 ? null : <ul>
          <li>City: {weather.name}</li>
          <li>ZIP Code: {zipCodes[currentTZipTabIndex].zip}</li>
          <li>Temp: {weather.main.temp}ºC</li>
          <li>Humidity: {weather.main.humidity}%</li>
          <li>Cloudiness: {weather.clouds.all}%</li>
        </ul>}
      </div>}
    </div >
  );
}

export default WeatherWidget;