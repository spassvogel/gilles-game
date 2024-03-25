import { type EnemyDefinition, type EnemyType } from './types'
import trolls from './trolls'
import orcs from './orcs'

const all = {
  ...trolls,
  ...orcs
}

export default all
export function getDefinition (enemy: EnemyType): EnemyDefinition {
  return all[enemy] as unknown as EnemyDefinition
}
