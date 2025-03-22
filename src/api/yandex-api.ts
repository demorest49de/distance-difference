import { Coordinates } from "../components/distance-calculator/distance-calculator"
import {GeoCoderResponse, GeoSuggestResponse, GeoSuggestResponseResults} from "../types/types"

export const fetchCoordinates = async (query: string): Promise<Coordinates | null> => {
  const apiKey = process.env.REACT_APP_YANDEX_MAPS_API_KEY
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=${query}&format=json&results=3`,
    )
    const data: GeoCoderResponse = await response.json()
    console.log(" data: ", data)
    if (data) {
      const [lng, lat] =
        data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(" ")
      return { lat: parseFloat(lat), lng: parseFloat(lng) }
    } else {
      return null
    }
  } catch (error) {
    console.error("Ошибка получения координат", error)
    return null
  }
}

export const fetchSuggestions = async (
  query: string,
): Promise<GeoSuggestResponseResults[] | null> => {
  const apiKey = process.env.REACT_APP_YANDEX_GEO_SUGGESTIONS_API_KEY
  try {
    const response = await fetch(
      `https://suggest-maps.yandex.ru/v1/suggest?apikey=${apiKey}&text=${query}&format=json&results=3`,
    )
    const data: GeoSuggestResponse = await response.json()
    console.log(" data: ", data)
    if (data?.results?.length > 0) {
      return data.results
    } else {
      return null
    }
  } catch (error) {
    console.error("Ошибка получения подсказок", error)
    return null
  }
}
