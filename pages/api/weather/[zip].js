export default function handler(req, res) {
  const { zip } = req.query
  return setTimeout(() => {
    return getWeatherByZIP(zip, res)
  }, 1000)
}

const getWeatherByZIP = async (zip, res) => {
  let isValid = /^\d{5}(-\d{4})?$/.test(zip)
  if (!isValid) return res.status(422).json({ code: 'INVALID_ZIP', message: 'Invalid ZIP Code' })
  let request = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},mx&units=metric&appid=${process.env.WEATHER_APIKEY}`
  let weatherData = await fetch(request)
    .then(response => response.status == 200 ? response.json() : false).then(data => data).catch(() => false)
  if (!weatherData) return res.status(404).json({ code: 'CITY_NOT_FOUND', message: 'City not found' })
  else return res.status(200).json(weatherData)
} 