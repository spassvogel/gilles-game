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
    case "setVerboseCombatLog": {
      return {
        verboseCombatLog: action.enabled
      }
    }
  }
  return state;
};

export const initialSettingsState = {
  verboseCombatLog: false
};
