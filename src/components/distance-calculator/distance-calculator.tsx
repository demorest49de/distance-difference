import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { fetchCoordinates, fetchSuggestions } from "../../api/yandex-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"
import s from "./distance-calculator.module.css"

export type Coordinates = {
  lat: number
  lng: number
}

const mockCoords1: Coordinates = { lat: 51.6687, lng: 39.184 }
const mockCoords2: Coordinates = { lat: 55.755864, lng: 37.617698 }

const mockSugg1: string[] = ["Воронеж", "Воронеж1", "Воронеж2"]
const mockSugg2: string[] = ["Москва", "Москва1", "Москва2"]

export default function DistanceCalculator() {
  const [city1, setCity1] = useState<string>("")
  const [city2, setCity2] = useState<string>("")
  const [coords1, setCoords1] = useState<Coordinates | null>(null)
  const [coords2, setCoords2] = useState<Coordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)

  const [suggestions1, setSuggestions1] = useState<string[]>([])
  const [suggestions2, setSuggestions2] = useState<string[]>([])

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const getSuggestions = async () => {
      if (city1.length > 2) {
        const suggestions = await fetchSuggestions(city1)
        setSuggestions1(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions1([])
      }
    }
    // void getSuggestions()
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
    // void getSuggestions()
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
      setIsAnimating(true)
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      const roundedDistance = roundToNearest10km(dist)
      setDistance(roundedDistance)
    }
  }, [coords1, coords2])

  const handlePlaceChanged = (
    e: ChangeEvent<HTMLInputElement>,
    setCity: Dispatch<SetStateAction<string>>,
  ) => {
    console.log(" e.target.value: ", e.target.value)
    setCity(e.target.value)
  }

  const handleCitySelect = (
    city: string,
    setCity: Dispatch<SetStateAction<string>>,
    setSuggestions: Dispatch<SetStateAction<string[]>>,
  ) => {
    setCity(city)
    setSuggestions([])
  }

  const handleAnimationEnd = () => {
    setIsAnimating(false)
  }

  const handleAnimation = () => {
    if (!(coords1 && coords2)) {
      return s.fade_in
    } else if (distance) {
      return s.fade_in
    } else {
      return s.fade_out
    }
  }

  return (
    <div>
      <h1>Расстояние между городами</h1>
      <div style={{ display: "flex", columnGap: "4px", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Город 1"
            value={city1}
            onChange={(e) => handlePlaceChanged(e, setCity1)}
          />
          <div style={{ height: "56px" }}>
            {suggestions1.length > 0 && (
              <ul style={{ fontSize: "14px", textAlign: "start" }}>
                {suggestions1.map((suggestion, index) => (
                  <li
                    className={s.geo_item}
                    key={index}
                    onClick={() => {
                      handleCitySelect(suggestion, setCity1, setSuggestions1)
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="Город 2"
            value={city2}
            onChange={(e) => handlePlaceChanged(e, setCity2)}
          />
          <div style={{ height: "56px" }}>
            {suggestions2.length > 0 && (
              <ul style={{ fontSize: "14px", textAlign: "start" }}>
                {suggestions2.map((suggestion, index) => (
                  <li
                    className={s.geo_item}
                    key={index}
                    onClick={() => {
                      handleCitySelect(suggestion, setCity2, setSuggestions2)
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${s.fade_text} ${handleAnimation()}`}
        // onAnimationEnd={handleAnimationEnd}
      >
        {distance ? <p>Расстояние: {distance} км</p> : <p>Введите названия городов</p>}
      </div>
    </div>
  )
}
