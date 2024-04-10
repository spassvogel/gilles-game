import { type Reducer } from 'redux'
import { type SettingsAction } from 'store/actions/settings'
import { type SettingsState } from 'store/types/settings'

export const initialSettingsState: SettingsState = {
  debug: {
    enableDebugDrawer: true,
    sceneShowPathable: false,
    sceneShowCellLocations: false,
    sceneShowActionQueue: false,
    mapShowGrid: false
  },
  language: 'en',
  verboseCombatLog: false
}

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const settings: Reducer<SettingsState, SettingsAction> = (state = initialSettingsState, action) => {
  switch (action.type) {
    case 'setSetting': {
      return {
        ...state,
        [action.setting]: action.value
      }
    }
  }
  return state
}
