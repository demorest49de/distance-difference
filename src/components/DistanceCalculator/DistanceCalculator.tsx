import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { fetchCoordinates } from "../../api/google-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"
import { Autocomplete, LoadScript } from "@react-google-maps/api"

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

  const autocompleteRef1 = useRef<google.maps.places.Autocomplete | null>(null)
  const autocompleteRef2 = useRef<google.maps.places.Autocomplete | null>(null)

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

  // Вычисление расстояния при изменении координат
  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      const roundedDistance = roundToNearest10km(dist)
      setDistance(roundedDistance)
    }
  }, [coords1, coords2])

  const handlePlaceChanged = (
    autocomplete: google.maps.places.Autocomplete,
    setCity: Dispatch<SetStateAction<string>>,
  ) => {
    const place = autocomplete.getPlace()
    if (place.name) {
      setCity(place.name)
    }
  }

  return (
    <div>
      <LoadScript googleMapsApiKey={""} libraries={['places']}>
        <div>
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef1.current = autocomplete)}
            onPlaceChanged={() => {
              handlePlaceChanged(autocompleteRef1.current!, setCity1)
            }}
          >
            <input type="text" value={city1} onChange={(e) => setCity1(e.target.value)} />
          </Autocomplete>
          <Autocomplete
              onLoad={(autocomplete) => (autocompleteRef2.current = autocomplete)}
              onPlaceChanged={() => handlePlaceChanged(autocompleteRef2.current!, setCity2)}
          >
            <input
                type="text"
                value={city2}
                onChange={(e) => setCity2(e.target.value)}
                placeholder="Введите название второго города"
            />
          </Autocomplete>
        </div>
      </LoadScript>
    </div>
  )
}
