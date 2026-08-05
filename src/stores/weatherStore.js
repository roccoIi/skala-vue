import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

// [상태 저장소]
// - 여러 화면(WeatherHomeView, WeatherDetailView 등)에서 공통으로 읽고 사용하는 데이터 보관
export const useWeatherStore = defineStore('weather', () => {
  const apiKey = import.meta.env.VITE_WEATHER_API // .env에 등록된 OpenWeather API 키 (getWeatherInfo/getForecastInfo 호출에 사용)

  // 정적 도시 좌표 데이터 (API 호출 없이 앱 시작 시점부터 사용 가능).
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

  // 현재 화면에 표시 중인 "실시간 날씨" 단건 데이터.
  // CurrentLocationCard(내 위치)와 WeatherDetailView(도시 상세)가 각각 위경도를 넘겨 이 값을 채운다.
  // 두 화면이 같은 필드를 공유하므로, 화면 전환 시 이전 값이 잠깐 남지 않도록 호출 측에서 null로 초기화 후 재요청
  const weatherInfoDetail = ref(null)

  // lat/lon → OpenWeather 현재 날씨 API 호출 → weatherInfoDetail에 저장.
  // 실패(주로 API 키 미설정/네트워크 오류) 시 사용자에게 alert만 띄우고 상태는 이전 값을 유지한다.
  const getWeatherInfo = async (lat, lon) => {
    try {
      const baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`
      const response = await axios.get(baseURL)
      weatherInfoDetail.value = response.data
    } catch {
      alert('주소를 확인해주세요.')
    }
  }

  // 5일치 3시간 간격 예보 객체
  const forecastList = ref(null)

  // lat/lon → OpenWeather 5일 예보 API 호출 → forecastList에 저장.
  // 실패 시 null이 아닌 빈 배열로 두어, 화면에서 "로딩 중"과 "조회 실패"를 구분해서 보여줄 수 있게 한다.
  const getForecastInfo = async (lat, lon) => {
    try {
      const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=kr&units=metric`
      const response = await axios.get(forecastURL)
      forecastList.value = response.data.list
    } catch {
      forecastList.value = []
    }
  }

  // SearchBar(el-autocomplete)의 입력값이 이 필드로 흘러들어온다 (SearchBar → WeatherHomeView emit).
  const searchKeyword = ref('')

  // searchKeyword가 바뀔 때마다 cityLocation을 재필터링
    const filteredCityLocation = computed(() => {
    const keyword = searchKeyword.value.trim()
    if (keyword === '') return cityLocation
    return cityLocation.filter(
      (city) => city.region.includes(keyword) || city.name.includes(keyword),
    )
  })

  // 섭씨/화씨 표시 단위. UnitToggler 버튼 클릭이 changeCelsius를 호출해 이 값을 뒤집으면,
  // 이 값을 참조하는 모든 화면(홈 카드, 현재 위치, 상세 페이지)의 온도 표시가 함께 갱신된다.
  const celsius = ref(true)

  // celsius 값을 반전시켜 단위를 전환. UnitToggler에서 호출
  const changeCelsius = () => {
    celsius.value = !celsius.value
  }

  // API 응답은 항상 섭씨(metric) 기준으로 오므로, celsius가 false일 때만 화씨로 변환해서 보여준다.
  const displayTemp = (temp) => {
    if (!celsius.value) return Math.round((temp * 9) / 5 + 32)
    else return temp
  }

  // 현재 단위에 맞는 기호('°C'/'°F'). displayTemp와 짝을 이뤄 화면 곳곳의 온도 표기에 사용
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
