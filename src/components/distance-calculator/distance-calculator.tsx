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

  const [suggestions1, setSuggestions1] = useState<string[] | null>(null)
  const [suggestions2, setSuggestions2] = useState<string[] | null>(null)

  const [isClicked1, setIsClicked1] = useState<boolean>(false)
  const [isClicked2, setIsClicked2] = useState<boolean>(false)

  console.log(" coords1  coords2: ", coords1, coords2)

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city1?.length > 2 && isClicked1) {
        const coords = await fetchCoordinates(city1)
        setCoords1(coords)
      } else {
        setCoords1(null)
        setIsClicked1(false)
      }
    }
    void getCoordinatesForCity()
  }, [city1])

  useEffect(() => {
    const getCoordinatesForCity = async () => {
      if (city2?.length > 2 && isClicked2) {
        const coords = await fetchCoordinates(city2)
        setCoords2(coords)
      } else {
        setCoords2(null)
        setIsClicked2(false)
      }
    }
    void getCoordinatesForCity()
  }, [city2])

  // suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (city1.length > 2 && suggestions1) {
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
      if (city2.length > 2 && suggestions2) {
        const suggestions = await fetchSuggestions(city2)
        setSuggestions2(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions2([])
      }
    }
    void getSuggestions()
  }, [city2])

  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      const roundedDistance = roundToNearest10km(dist)
      setDistance(roundedDistance)
    } else {
      setDistance(null)
    }
  }, [coords1, coords2])

  const handlePlaceChanged = (
    e: ChangeEvent<HTMLInputElement>,
    setCity: Dispatch<SetStateAction<string>>,
  ) => {
    setCity(e.target.value)
  }

  const handleCitySelect = (
    city: string,
    setCity: Dispatch<SetStateAction<string>>,
    setSuggestions: Dispatch<SetStateAction<string[]> | null>,
    setIsClicked: Dispatch<SetStateAction<boolean>>,
  ) => {
    setCity(city)
    setSuggestions(null)
    setIsClicked(true)
  }

  const handleAnimation = () => {
    if (!(coords1 && coords2)) {
      return s.fade_in
    } else if (coords1 && coords2) {
      return s.fade_in
    } else if (!distance) {
      return s.fade_in
    } else {
      return s.fade_out
    }
  }

  return (
    <div>
      <h1>Расстояние между городами</h1>
      <div style={{ display: "flex", columnGap: "5px", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            style={{ width: "200px" }}
            type="text"
            placeholder="Город 1"
            value={city1}
            onChange={(e) => handlePlaceChanged(e, setCity1)}
          />
          <div style={{ height: "56px" }}>
            {(suggestions1?.length as number) > 0 && (
              <ul style={{ fontSize: "14px", textAlign: "start" }}>
                {suggestions1?.map((suggestion, index) => (
                  <li
                    className={s.geo_item}
                    key={index}
                    onClick={() => {
                      handleCitySelect(
                        suggestion,
                        setCity1,
                        setSuggestions1 as Dispatch<SetStateAction<string[]> | null>,
                        setIsClicked1 as Dispatch<SetStateAction<boolean>>,
                      )
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
            style={{ width: "200px" }}
            type="text"
            placeholder="Город 2"
            value={city2}
            onChange={(e) => handlePlaceChanged(e, setCity2)}
          />
          <div style={{ height: "56px" }}>
            {(suggestions2?.length as number) > 0 && (
              <ul style={{ fontSize: "14px", textAlign: "start" }}>
                {suggestions2?.map((suggestion, index) => (
                  <li
                    className={s.geo_item}
                    key={index}
                    onClick={() => {
                      handleCitySelect(
                        suggestion,
                        setCity2,
                        setSuggestions2 as Dispatch<SetStateAction<string[]> | null>,
                        setIsClicked2 as Dispatch<SetStateAction<boolean>>,
                      )
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
      {/*{distance ? <p>Расстояние: {distance} км</p> : <p>Введите названия городов</p>}*/}
      <div className={`${s.fade_text} ${handleAnimation()}`}>
        {distance ? (
          <p>Расстояние: {distance} км</p>
        ) : city1.toLocaleLowerCase().trim() === city2.toLocaleLowerCase().trim() ? (
          <p>Введите разные названия городов</p>
        ) : (
          <p>Введите названия городов</p>
        )}
      </div>
    </div>
  )
}
