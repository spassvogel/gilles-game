import { type Location } from 'utils/tilemap'

// This is the format AStarFind works with
export const convertIn = (l: Location) => ({ x: l[0], y: l[1] })
export const convertOut = (input: number[]): Location => [input[0], input[1]]
