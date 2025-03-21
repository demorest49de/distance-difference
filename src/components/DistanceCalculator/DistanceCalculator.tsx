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
    void getCoordinatesForCity()
  }, [city2])

  const roundToNearest10km = (distance: number): number => {
    return Math.round(distance / 10) * 10 // Округление до ближайших 10 км
  }

  // Вычисление расстояния при изменении координат
  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      const roundedDistance = roundToNearest10km(dist)
      setDistance(roundedDistance)
    }
  }, [coords1, coords2])

  return <div></div>
}
