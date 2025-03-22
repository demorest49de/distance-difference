import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { fetchCoordinates, fetchSuggestions } from "../../api/yandex-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"

export type Coordinates = {
  lat: number
  lng: number
}

const fakeCoords1: Coordinates = { lat: 51.6687, lng: 39.184 }
const fakeCoords2: Coordinates = { lat: 55.755864, lng: 37.617698 }

export default function DistanceCalculator() {
  const [city1, setCity1] = useState<string>("Воронеж")
  const [city2, setCity2] = useState<string>("Москва")
  const [coords1, setCoords1] = useState<Coordinates | null>(fakeCoords1)
  const [coords2, setCoords2] = useState<Coordinates | null>(fakeCoords2)
  const [distance, setDistance] = useState<number | null>(null)

  const [suggestions1, setSuggestions1] = useState<string[]>([])
  const [suggestions2, setSuggestions2] = useState<string[]>([])

  useEffect(() => {
    const getSuggestions = async () => {
      if (city1.length > 2) {
        const suggestions = await fetchSuggestions(city1)
        setSuggestions1(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions1([])
      }
    }
    void getSuggestions()
  }, [city1])

  useEffect(() => {
    const getSuggestions = async () => {
      if (city2.length > 2) {
        const suggestions = await fetchSuggestions(city2)
        setSuggestions2(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions2([])
      }
    }
    void getSuggestions()
  }, [city2])

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city1) {
        const coords = await fetchCoordinates(city1)
        setCoords1(coords)
      }
    }
    // void getCoordinatesForCity()
  }, [city1])

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city2) {
        const coords = await fetchCoordinates(city2)
        setCoords2(coords)
      }
    }
    // void getCoordinatesForCity()
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
      <div style={{ display: "flex", columnGap: "4px", justifyContent: "center" }}>
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
