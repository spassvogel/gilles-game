import { Reducer } from "redux";
import { SettingsAction } from "store/actions/settings";
import { SettingsState } from "store/types/settings";

/**
 * reducer
 * @param state
 * @param action
 */
export const settings: Reducer<SettingsState, SettingsAction> = (state = initialSettingsState, action) => {
  switch (action.type) {
    case "setSetting": {
      return {
        ...state,
        [action.setting]: action.value
      }
    }
  }
  return state;
};

export const initialSettingsState: SettingsState = {
  verboseCombatLog: false,
  debugAllowAdventurerEdit: false,
  debugSceneShowPathable: false,
  debugSceneShowActionQueue: false,
};
