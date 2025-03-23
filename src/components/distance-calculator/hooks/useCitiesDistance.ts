import { useEffect, useState } from "react"
import { Coordinates } from "../distance-calculator"
import { fetchCoordinates, fetchSuggestions } from "../../../api/yandex-api"
import { calculateDistance } from "../../../utils/calculator"
import { roundToNearest10km } from "../../../utils/distanceRound"

export const useCitiesDistance = () => {
  const [city1, setCity1] = useState<string>("")
  const [city2, setCity2] = useState<string>("")
  const [coords1, setCoords1] = useState<Coordinates | null>(null)
  const [coords2, setCoords2] = useState<Coordinates | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [suggestions1, setSuggestions1] = useState<string[] | null>(null)
  const [suggestions2, setSuggestions2] = useState<string[] | null>(null)

  useEffect(() => {
    const getCoordinates = async () => {
      if (city1.length > 2) {
        const coords = await fetchCoordinates(city1)
        setCoords1(coords)
      } else {
        setCoords1(null)
      }
    }
    const timer = setTimeout(() => void getCoordinates(), 500)
    return () => clearTimeout(timer)
  }, [city1])

  useEffect(() => {
    const getCoordinates = async () => {
      if (city2.length > 2) {
        const coords = await fetchCoordinates(city2)
        setCoords2(coords)
      } else {
        setCoords2(null)
      }
    }
    const timer = setTimeout(() => void getCoordinates(), 500)
    return () => clearTimeout(timer)
  }, [city2])

  useEffect(() => {
    const getSuggestions = async () => {
      if (city1.length > 2 && suggestions1) {
        const suggestions = await fetchSuggestions(city1.trim())
        setSuggestions1(suggestions?.map((s) => s.title.text) || [])
      } else {
        setSuggestions1([])
      }
    }
    const timer = setTimeout(() => void getSuggestions(), 500)
    return () => clearTimeout(timer)
  }, [city1])

  useEffect(() => {
    const getSuggestions = async () => {
      if (city2.length > 2 && suggestions2) {
        const suggestions = await fetchSuggestions(city2.trim())
        setSuggestions2(suggestions?.map((s) => s.title.text) || [])
      } else {
        setSuggestions2([])
      }
    }
    const timer = setTimeout(() => void getSuggestions(), 500)
    return () => clearTimeout(timer)
  }, [city2])

  useEffect(() => {
    if (coords1 && coords2) {
      const dist = calculateDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng)
      setDistance(roundToNearest10km(dist))
    } else {
      setDistance(null)
    }
  }, [coords1, coords2])

  return {
    city1,
    setCity1,
    city2,
    setCity2,
    suggestions1,
    suggestions2,
    setSuggestions1,
    setSuggestions2,
    distance,
  }
}
