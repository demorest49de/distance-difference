import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { fetchCoordinates } from "../../api/yandex-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"
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

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city1) {
        const coords = await fetchCoordinates(city1)
        setCoords1(coords)
      }
    }
    void getCoordinatesForCity()
  }, [city1])

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city2) {
        const coords = await fetchCoordinates(city2)
        setCoords2(coords)
      }
    }
    void getCoordinatesForCity()
  }, [city2])

  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      const roundedDistance = roundToNearest10km(dist)
      setDistance(roundedDistance)
    }
  }, [coords1, coords2])



  const handlePlaceChanged = (
    e: ChangeEvent<HTMLInputElement>,
    setCity: Dispatch<SetStateAction<string>>,
  ) => {
    setCity(e.target.value)
  }

  return (
    <div>
      <h1>Расстояние между городами</h1>
      <div>
        <input
          type="text"
          placeholder="Город 1"
          value={city1}
          onChange={(e) => handlePlaceChanged(e, setCity1)}
        />
        <input
          type="text"
          placeholder="Город 2"
          value={city2}
          onChange={(e) => handlePlaceChanged(e, setCity2)}
        />
      </div>
      {distance && <p>Расстояние: {distance} км</p>}
    </div>
  )
}
