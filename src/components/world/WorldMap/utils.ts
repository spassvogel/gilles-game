import { type QuestStoreState } from 'store/types/quest'
import { type Coords, lerpLocation } from 'utils/lerp'
import { getDefinition } from 'definitions/quests'
import { Point } from 'pixi.js'

const GRID_WIDTH = 10 // width or height of each node location in pixels
export const FULL_HEIGHT = 1024
export const SMALL_HEIGHT = 64 // Used when QuestPanel is open
export const WORLD_WIDTH = 1500
export const WORLD_HEIGHT = 1061

export const getQuestWorldLocation = (quest: QuestStoreState): Coords => {
  const questDefinition = getDefinition(quest.name)
  const roundedProgress = Math.floor(quest.progress)
  const lastNode = questDefinition.nodes[roundedProgress]

  const nextNode = questDefinition.nodes[roundedProgress + 1]
  if (nextNode == null) {
    // We've reached the last node
    return lastNode
  }
  return lerpLocation(lastNode, nextNode, quest.progress - roundedProgress)
}

// Node locations work on a centered coordinate system
export const nodeLocationToPoint = (location: { x: number, y: number }) => {
  const x = location.x * GRID_WIDTH + WORLD_WIDTH / 2
  const y = location.y * GRID_WIDTH + WORLD_HEIGHT / 2
  return new Point(x, y)
}

export const getPreviousPositions = (quest: QuestStoreState) => {
  const positions: Point[] = []
  const questDefinition = getDefinition(quest.name)

  for (let i = 0; i < quest.progress; i++) {
    positions.push(nodeLocationToPoint(questDefinition.nodes[i]))
  }
  const lastPosition = nodeLocationToPoint(getQuestWorldLocation(quest))
  positions.push(lastPosition)
  return positions
}
