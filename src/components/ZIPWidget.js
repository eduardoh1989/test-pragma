import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import styles from '../styles/zip-widget.module.scss'

import { HiPlusCircle, HiSearchCircle, HiTrash, HiEye } from "react-icons/hi"
import { AiOutlineLoading } from "react-icons/ai"

import {
  selectZipCodes,
  selectWaitingAPI,
  addZipCode,
  setZipCode,
  removeZipCode,
  setWaitingAPI,
  setWeather,
  setRequestTimestamp,
  setCurrentTZipTabIndex,
  setCityNotFound,
  selectCurrentTZipTabIndex
} from '../store/slices/weatherSlice'

const ZIPWidget = () => {
  const dispatch = useDispatch()
  const zipCodes = useSelector(selectZipCodes)
  const waitingAPI = useSelector(selectWaitingAPI)
  const currentZipTabIndex = useSelector(selectCurrentTZipTabIndex)

  const [inputChangingTimer, setInputChangingTimer] = useState(null)
  const [inputChangingIndex, setInputChangingIndex] = useState(false)
  const [inputChanging, setInputChanging] = useState(false)
  const [currentZIPCode, setCurrentZIPCode] = useState('')
  const [zipRequestIndex, setZipRequestIndex] = useState(null)
  const [reviewZipList, setReviewZipList] = useState(false)

  const addZipCodeHandler = () => {
    if (zipCodes.length == process.env.NEXT_PUBLIC_ZIPCODES_LIMIT) return
    dispatch(addZipCode())
  }
  const removeZipCodeHandler = (i) => {
    if (inputChanging) return
    dispatch(setCurrentTZipTabIndex(-1))
    dispatch(removeZipCode(i))
  }
  const findWeather = async (i) => {
    if (!zipCodes[i].isValid || waitingAPI) return
    dispatch(setWaitingAPI(true))
    setZipRequestIndex(i)
    let weatherData = await fetch(`/api/weather/${zipCodes[i].zip}`)
      .then(response => response.status == 200 ? response.json() : false).then(data => data).catch(() => false)
    dispatch(setWaitingAPI(false))
    if (!weatherData) {
      dispatch(setWeather({ index: i, weather: null }))
      dispatch(setRequestTimestamp({ index: i, timestamp: 0 }))
      dispatch(setCurrentTZipTabIndex(-1))
      return dispatch(setCityNotFound(true))
    }
    dispatch(setWeather({ index: i, weather: weatherData }))
    dispatch(setCurrentTZipTabIndex(i))
    dispatch(setRequestTimestamp({ index: i, timestamp: Date.now() }))
    dispatch(setCityNotFound(false))
  }
  const viewWeather = (i) => {
    if (!zipCodes[i].isValid || waitingAPI) return
    dispatch(setCurrentTZipTabIndex(i))
    dispatch(setCityNotFound(false))
  }
  const inputHandler = (e, i) => {
    setCurrentZIPCode(e.target.value)
    setInputChangingIndex(i)
  }
  const validateZip = () => {
    let isValid = /^\d{5}(-\d{4})?$/.test(currentZIPCode)
    let alreadyExists = zipCodes.filter((el, i) => (el.zip == currentZIPCode && i !== inputChangingIndex)).length > 0
    let requestTimestamp = (currentZIPCode == zipCodes[inputChangingIndex].zip) ? zipCodes[inputChangingIndex].requestTimestamp : 0
    let payload = {
      index: inputChangingIndex,
      zipCode: {
        zip: currentZIPCode,
        isValid: isValid && !alreadyExists,
        alreadyExists,
        weather: null,
        requestTimestamp: requestTimestamp
      }
    }
    dispatch(setZipCode(payload))
  }
  useEffect(() => {
    if (currentZIPCode == '') return
    if (!inputChanging) setInputChanging(true)
    clearTimeout(inputChangingTimer)
    let timer = setTimeout(() => {
      setInputChanging(false)
      validateZip()
    }, [1000])
    setInputChangingTimer(timer)
    return () => (clearTimeout(timer))
  }, [currentZIPCode])
  useEffect(() => {
    if (reviewZipList) return
    setReviewZipList(true)
  }, [zipCodes])
  useEffect(() => {
    zipCodes.map((zipCode, i) => {
      if (!reviewZipList) return
      if (zipCode.alreadyExists == true) {
        let isValid = /^\d{5}(-\d{4})?$/.test(zipCode.zip)
        let alreadyExists = zipCodes.filter((el, j) => (el.zip == zipCode.zip && i !== j)).length > 0
        let payload = {
          index: i,
          zipCode: {
            zip: zipCode.zip,
            isValid: isValid && !alreadyExists,
            alreadyExists,
            weather: null,
            requestTimestamp: zipCode.requestTimestamp
          }
        }
        dispatch(setZipCode(payload))
      }
    })
    setReviewZipList(false)
  }, [reviewZipList])


  return (
    <div className={styles['zip-widget']}>
      <div className={`${!zipCodes.length ? styles['init-style'] : ''} ${styles['admin-tools']}`}>
        <h2>Add<br /> a<br /> ZIP<br /> code</h2>
        <div className={styles['buttons-container']}>
          <button onClick={addZipCodeHandler}><HiPlusCircle /></button>
        </div>
      </div>
      {!zipCodes.length ? null : <div className={`${zipCodes.length ? styles['show'] : ''} ${styles['zip-forms']}`}>
        <ul>
          {zipCodes.map((zipCode, i) => (
            <li key={`zip-form-${i}`}>
              <div className={styles['zip-form']}>
                <input type='text' placeholder='ZIP Code' onChange={(e) => (inputHandler(e, i))} value={(inputChanging && inputChangingIndex == i) ? currentZIPCode : zipCodes[i].zip} />
                <div className={`${styles['spinner']} ${(inputChanging && inputChangingIndex == i) ? styles.active : ''}`}><AiOutlineLoading /></div>
                {(zipCodes[i].requestTimestamp == 0) ? (
                  <button className={zipCodes[i].isValid ? styles.enabled : ''} onClick={() => (findWeather(i))}>
                    {waitingAPI && zipRequestIndex == i ? <AiOutlineLoading className={styles.spinner} /> : <HiSearchCircle />}
                  </button>
                ) : (
                  <button className={`${styles.enabled} ${currentZipTabIndex == i ? styles.active : ''}`} onClick={() => (viewWeather(i))}>
                    <HiEye />
                  </button>
                )}
                <button className={inputChanging ? '' : styles.enabled} onClick={() => (removeZipCodeHandler(i))}><HiTrash /></button>
              </div>
              {zipCodes[i].alreadyExists ? <span className={styles.error}>ZIP Code already exists</span> : ''}
            </li>
          ))}
        </ul>
      </div>}
    </div>
  );
}

export default ZIPWidget;