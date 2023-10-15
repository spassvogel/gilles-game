import { useEffect } from 'react'
import { Orientation } from './utils'

export const useRandomOrientation = (enabled: boolean, orientation: Orientation, setOrientation: React.Dispatch<React.SetStateAction<Orientation>>) => {
  useEffect(() => {
    if (!enabled) return

    // Idle animation
    // Randomly turn left or right
    const randomOrientation = () => {
      const left = Math.random() < 0.5
      if (orientation === Orientation.north && left) {
        setOrientation(Orientation.northWest)
      } else if (orientation === Orientation.northWest && left) {
        setOrientation(Orientation.west)
      } else if (orientation === Orientation.west && left) {
        setOrientation(Orientation.southWest)
      } else if (orientation === Orientation.southWest && left) {
        setOrientation(Orientation.south)
      } else if (orientation === Orientation.south && left) {
        setOrientation(Orientation.southEast)
      } else if (orientation === Orientation.southEast && left) {
        setOrientation(Orientation.east)
      } else if (orientation === Orientation.east && left) {
        setOrientation(Orientation.northEast)
      } else if (orientation === Orientation.northEast && left) {
        setOrientation(Orientation.north)
      }
      if (orientation === Orientation.north && !left) {
        setOrientation(Orientation.northEast)
      } else if (orientation === Orientation.northEast && !left) {
        setOrientation(Orientation.east)
      } else if (orientation === Orientation.east && !left) {
        setOrientation(Orientation.southEast)
      } else if (orientation === Orientation.southEast && !left) {
        setOrientation(Orientation.south)
      } else if (orientation === Orientation.south && !left) {
        setOrientation(Orientation.southWest)
      } else if (orientation === Orientation.southWest && !left) {
        setOrientation(Orientation.west)
      } else if (orientation === Orientation.west && !left) {
        setOrientation(Orientation.northWest)
      } else if (orientation === Orientation.northWest && !left) {
        setOrientation(Orientation.north)
      }
    }
    const minDuration = 2000
    const maxDuration = 4000
    const duration = minDuration + Math.random() * maxDuration
    const interval = setInterval(randomOrientation, duration)
    return () => { clearInterval(interval) }
  }, [enabled, orientation, setOrientation])
}
