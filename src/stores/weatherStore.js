import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const apiKey = '81d985d082f46789a9c0d7e9700bc235'

  // 서울(강남), 경기(파주, 수원), 강원(강릉, 춘천), 충북(충주, 청주), 충남(서산, 대전), 경북(안동, 구미), 대구, 울산, 부산, 전북(전주, 광주, 목포) 제주, 울릉도, 독도
  const cityLocation = [
    { id: 'city_01', region: '서울특별시', name: '서울', lat: 37.5172, lon: 127.0495 },
    { id: 'city_02', region: '경기도', name: '파주', lat: 37.8154, lon: 126.7799 },
    { id: 'city_03', region: '경기도', name: '수원', lat: 37.2636, lon: 127.0286 },
    { id: 'city_04', region: '강원도', name: '강릉', lat: 37.7519, lon: 128.8761 },
    { id: 'city_05', region: '강원도', name: '춘천', lat: 37.8813, lon: 127.7298 },
    { id: 'city_06', region: '충청북도', name: '충주', lat: 36.991, lon: 127.9259 },
    { id: 'city_07', region: '충청북도', name: '청주', lat: 36.6424, lon: 127.489 },
    { id: 'city_08', region: '충청남도', name: '서산', lat: 36.7848, lon: 126.4503 },
    { id: 'city_09', region: '대전광역시', name: '대전', lat: 36.3504, lon: 127.3845 },
    { id: 'city_10', region: '경상북도', name: '안동', lat: 36.5684, lon: 128.7297 },
    { id: 'city_11', region: '경상북도', name: '구미', lat: 36.1195, lon: 128.3446 },
    { id: 'city_12', region: '대구광역시', name: '대구', lat: 35.8714, lon: 128.6014 },
    { id: 'city_13', region: '울산광역시', name: '울산', lat: 35.5384, lon: 129.3114 },
    { id: 'city_14', region: '부산광역시', name: '부산', lat: 35.1796, lon: 129.0756 },
    { id: 'city_15', region: '전북특별자치도', name: '전주', lat: 35.8242, lon: 127.148 },
    { id: 'city_16', region: '전남광주통합특별시', name: '광주', lat: 35.1595, lon: 126.8526 },
    { id: 'city_17', region: '전남광주통합특별시', name: '목포', lat: 34.8118, lon: 126.3922 },
    { id: 'city_18', region: '제주특별자치도', name: '제주', lat: 33.4996, lon: 126.5312 },
    { id: 'city_19', region: '경상북도', name: '울릉도', lat: 37.4845, lon: 130.9057 },
    { id: 'city_20', region: '경상북도', name: '독도', lat: 37.2417, lon: 131.8611 },
  ]

  const weatherInfoDetail = ref(null)

  const getWeatherInfo = async (lat, lon) => {
    try {
      const baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`
      const response = await axios.get(baseURL)
      weatherInfoDetail.value = response.data
    } catch {
      alert('주소를 확인해주세요.')
    }
  }

  const forecastList = ref(null)

  const getForecastInfo = async (lat, lon) => {
    try {
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`
      const response = await axios.get(forecastURL)
      forecastList.value = response.data.list
    } catch {
      forecastList.value = []
    }
  }

  const searchKeyword = ref('')

  const filteredCityLocation = computed(() => {
    const keyword = searchKeyword.value.trim()
    if (keyword === '') return cityLocation
    return cityLocation.filter(
      (city) => city.region.includes(keyword) || city.name.includes(keyword),
    )
  })

  const celsius = ref(true)

  const changeCelsius = () => {
    celsius.value = !celsius.value
  }

  const displayTemp = (temp) => {
    if (!celsius.value) return Math.round((temp * 9) / 5 + 32)
    else return temp
  }

  const unitSymbol = computed(() => (celsius.value ? '°C' : '°F'))

  return {
    weatherInfoDetail,
    getWeatherInfo,
    forecastList,
    getForecastInfo,
    searchKeyword,
    cityLocation,
    filteredCityLocation,
    celsius,
    changeCelsius,
    displayTemp,
    unitSymbol,
  }
})
