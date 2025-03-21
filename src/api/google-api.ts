import axios from "axios"
import { Coordinates } from "../components/DistanceCalculator/DistanceCalculator"

export const fetchCoordinates = async (city: string): Promise<Coordinates | null> => {
  const apiKey = process.env.OPENCAGEDATA_API_KEY
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`,
    )
    const data = response.data.results[0]?.geometry
    if (data) {
      return { lat: data.lat, lng: data.lng }
    } else {
      return null
    }
  } catch (error) {
    console.error("Ошибка получения координат", error)
    return null
  }
}
