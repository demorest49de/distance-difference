// Типы для данных, получаемых с API
import { useEffect, useState } from "react"
import { fetchCoordinates } from "../../api/google-api"
import { calculateDistance } from "../../utils/calculator"

export type Coordinates = {
  lat: number
  lng: number
}

export default function DistanceCalculator() {
  const [city1, setCity1] = useState<string>("")
  const [city2, setCity2] = useState<string>("")
  const [coords1, setCoords1] = useState<Coordinates | null>(null)
  const [coords2, setCoords2] = useState<Coordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  // Обработчик для изменения города 1
  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city1) {
        const coords = await fetchCoordinates(city1)
        setCoords1(coords)
      }
    }
    void getCoordinatesForCity()
  }, [city1])

  // Обработчик для изменения города 2
  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city2) {
        const coords = await fetchCoordinates(city2)
        setCoords2(coords)
      }
    }
    getCoordinatesForCity()
  }, [city2])

  // Вычисление расстояния при изменении координат
  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      setDistance(dist)
    }
  }, [coords1, coords2])

  return <div></div>
}
