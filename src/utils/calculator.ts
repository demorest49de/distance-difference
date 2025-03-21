export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const a = 6378137 // Радиус Земли на экваторе в метрах (большая полуось)
  const f = 1 / 298.257223563 // Сжатие эллипсоида
  const b = (1 - f) * a // Малая полуось эллипсоида

  // Переводим градусы в радианы
  const toRad = (x: number) => (x * Math.PI) / 180

  const lat1Rad = toRad(lat1) // широта первой точки
  const lat2Rad = toRad(lat2) // широта второй точки
  const lon1Rad = toRad(lon1) // долгота первой точки
  const lon2Rad = toRad(lon2) // долгота второй точки

  // Разница долгот
  const deltaLon = lon2Rad - lon1Rad

  // Рассчитываем с использованием эллипсоидальной модели
  const sinLat1 = Math.sin(lat1Rad)
  const sinLat2 = Math.sin(lat2Rad)

  // Применяем упрощенные формулы для вычисления расстояния
  const U1 = Math.atan((1 - f) * Math.tan(lat1Rad))
  const U2 = Math.atan((1 - f) * Math.tan(lat2Rad))

  const cosU1 = Math.cos(U1)
  const cosU2 = Math.cos(U2)

  const sinDeltaSigma = Math.sqrt(
    Math.pow(cosU2 * Math.sin(deltaLon), 2) +
      Math.pow(cosU1 * sinLat2 - sinLat1 * cosU2 * Math.cos(deltaLon), 2),
  )
  const cosDeltaSigma = sinLat1 * sinLat2 + cosU1 * cosU2 * Math.cos(deltaLon)

  const sigma = Math.atan2(sinDeltaSigma, cosDeltaSigma) // Центр угла

  // Расстояние по эллипсойду
  const distance = b * sigma // Расстояние в метрах

  return distance / 1000 // Переводим в километры
}
