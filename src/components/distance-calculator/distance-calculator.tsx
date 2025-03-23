import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { fetchCoordinates, fetchSuggestions } from "../../api/yandex-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"
import s from "./distance-calculator.module.css"

export type Coordinates = {
  lat: number
  lng: number
}
enum Key {
  Enter = "Enter",
  Escape = "Escape",
}

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

  //geocoder
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
    const timer = setTimeout(() => {
      void getCoordinatesForCity()
    }, 500)
    return () => clearTimeout(timer)
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
    const timer = setTimeout(() => {
      void getCoordinatesForCity()
    }, 500)
    return () => clearTimeout(timer)
  }, [city2])

  // suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (city1.length > 2 && suggestions1) {
        const suggestions = await fetchSuggestions(city1.trim())
        setSuggestions1(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions1([])
      }
    }
    const timer = setTimeout(() => {
      void getSuggestions()
    }, 500)
    return () => clearTimeout(timer)
  }, [city1])

  useEffect(() => {
    const getSuggestions = async () => {
      if (city2.length > 2 && suggestions2) {
        const suggestions = await fetchSuggestions(city2.trim())
        setSuggestions2(suggestions?.map((suggestion) => suggestion.title.text) as string[])
      } else {
        setSuggestions2([])
      }
    }
    const timer = setTimeout(() => {
      void getSuggestions()
    }, 500)
    return () => clearTimeout(timer)
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
    suggestedGeo: string,
    setCity: Dispatch<SetStateAction<string>>,
    setSuggestions: Dispatch<SetStateAction<string[]> | null>,
    setIsClicked: Dispatch<SetStateAction<boolean>>,
  ) => {
    setCity(suggestedGeo)
    setSuggestions(null)
    setIsClicked(true)
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    city: string,
    setCity: Dispatch<SetStateAction<string>>,
    setSuggestions: Dispatch<SetStateAction<string[]> | null>,
    setIsClicked: Dispatch<SetStateAction<boolean>>,
  ) {
    if (e.key === Key.Enter) {
      handleCitySelect(city, setCity, setSuggestions, setIsClicked)
    }
    if (e.key === Key.Escape) {
      setSuggestions(null)
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
            title="Введите название города и выберите его в подсказке ниже нажав Enter"
            value={city1}
            onChange={(e) => handlePlaceChanged(e, setCity1)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              debugger
              const suggested = suggestions1?.length! > 0 ? suggestions1![0] : city1
              handleKeyDown(
                e,
                suggested,
                setCity1,
                setSuggestions1 as Dispatch<SetStateAction<string[]> | null>,
                setIsClicked1,
              )
            }}
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
            title="Введите название города и выберите его в подсказке ниже нажав Enter"
            value={city2}
            onChange={(e) => handlePlaceChanged(e, setCity2)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              const suggested = suggestions2?.length! > 0 ? suggestions2![0] : city2
              handleKeyDown(
                e,
                suggested,
                setCity2,
                setSuggestions2 as Dispatch<SetStateAction<string[]> | null>,
                setIsClicked2,
              )
            }}
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
      {distance ? (
        <p>Расстояние: {distance} км</p>
      ) : city1.toLocaleLowerCase().trim() === city2.toLocaleLowerCase().trim() &&
        city1.trim() !== "" ? (
        <p>Введите разные названия городов</p>
      ) : (
        <p>Введите названия городов</p>
      )}
    </div>
  )
}
