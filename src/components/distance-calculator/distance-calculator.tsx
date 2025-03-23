import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { fetchCoordinates, fetchSuggestions } from "../../api/yandex-api"
import { calculateDistance } from "../../utils/calculator"
import { roundToNearest10km } from "../../utils/distanceRound"
import s from "./distance-calculator.module.css"
import { useCitiesDistance } from "./hooks/useCitiesDistance"

export type Coordinates = {
  lat: number
  lng: number
}
enum Key {
  Enter = "Enter",
  Escape = "Escape",
}

export default function DistanceCalculator() {
  const {
    city1,
    city2,
    distance,
    setCity1,
    setCity2,
    suggestions1,
    suggestions2,
    setSuggestions1,
    setSuggestions2,
  } = useCitiesDistance()

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
  ) => {
    setCity(suggestedGeo)
    setSuggestions(null)
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    city: string,
    setCity: Dispatch<SetStateAction<string>>,
    setSuggestions: Dispatch<SetStateAction<string[]> | null>,
  ) {
    if (e.key === Key.Enter) {
      handleCitySelect(city, setCity, setSuggestions)
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
