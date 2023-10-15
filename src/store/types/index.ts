import { type AdventurerStoreState } from './adventurer'
import { type EngineStoreState } from './engine'
import { type GameStoreState } from './game'
import { type LogEntry } from './logEntry'
import { type QuestStoreState } from './quest'
import { type ResourceStoreState } from './resources'
import { type SeedRandomState } from './seedRandom'
import { type SettingsState } from './settings'
import { type StockpileStoreState } from './stockpile'
import { type StructuresStoreState } from './structures'
import { type TasksStoreState } from './tasks'

export type StoreState = {
  adventurers: AdventurerStoreState[]
  engine: EngineStoreState
  game: GameStoreState
  gold: number
  log: LogEntry[]
  stockpile: StockpileStoreState // items in warehouse
  resources: ResourceStoreState
  rngState: SeedRandomState
  settings: SettingsState
  structures: StructuresStoreState
  tasks: TasksStoreState
  quests: QuestStoreState[]
  workers: number
}
