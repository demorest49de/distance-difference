export const roundToNearest10km = (distance: number): number => {
  return Math.round(distance / 10) * 10 // Округление до ближайших 10 км
}
