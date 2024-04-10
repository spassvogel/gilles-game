import { type Language } from './language'

export type SettingsState = {
  debug: {
    enableDebugDrawer: boolean
    sceneShowPathable: boolean
    sceneShowCellLocations: boolean
    sceneShowActionQueue: boolean
    mapShowGrid: boolean
  }
  language: Language
  verboseCombatLog: boolean
}
