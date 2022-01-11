import { Reducer } from 'redux';
import { SettingsAction } from 'store/actions/settings';
import { SettingsState } from 'store/types/settings';


export const initialSettingsState: SettingsState = {
  verboseCombatLog: false,
  debugAllowAdventurerEdit: false,
  debugSceneShowPathable: false,
  debugSceneShowActionQueue: false,
};

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
        [action.setting]: action.value,
      };
    }
  }
  return state;
};