import { type AdventurerAction } from './adventurers'
import { type GameAction } from './game'
import { type GoldAction } from './gold'
import { type LogAction } from './log'
import { type QuestAction } from './quests'
import { type ResourcesAction } from './resources'
import { type SettingsAction } from './settings'
import { type StockpileAction } from './stockpile'
import { type StructuresAction } from './structures'
import { type TaskAction } from './tasks'
import { type WorkersAction } from './workers'

export type Action = AdventurerAction | GameAction | GoldAction | LogAction | QuestAction | ResourcesAction | SettingsAction | StockpileAction | StructuresAction | TaskAction | WorkersAction
