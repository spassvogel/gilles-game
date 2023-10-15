import kill10Boars from './kill10Boars'
import retrieveMagicAmulet from './retrieveMagicAmulet'
import { type QuestDefinition } from './types'

// const fulruhmRaid: QuestDefinition = {
//   nodes: [{
//     x: -4,
//     y: -1,
//     type: QuestNodeType.nothing,
//   }, {
//     x: -4,
//     y: -1,
//     type: QuestNodeType.nothing,

const all = {
  kill10Boars,
  retrieveMagicAmulet
}

export default all

export function getDefinition<T = unknown> (questName: string): QuestDefinition<T> {
  return all[questName as keyof typeof all] as unknown as QuestDefinition<T>
}
