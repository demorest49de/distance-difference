import { Coordinates } from "../components/DistanceCalculator/DistanceCalculator"

export const fetchCoordinates = async (city: string): Promise<Coordinates | null> => {
  const apiKey = process.env.REACT_APP_YANDEX_MAPS_API_KEY
  try {
    const response = await fetch(
      `https://geocode-maps.yandex.ru/v1/?apikey=${apiKey}&geocode=воронеж&format=json`,
    )
    const data = await response.json()
    console.log(' data: ', data);
    if (data) {
      const [lng, lat] = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ')
      return { lat: parseFloat(lat), lng: parseFloat(lng) }
    } else {
      return null
    }
  } catch (error) {
    console.error("Ошибка получения координат", error)
    return null
  }
}
