import { SettingsState } from 'store/types/settings';

export type SettingsAction = {
  type: 'setSetting',
  setting: keyof SettingsState
  value: unknown
};

export const setSetting = (setting: keyof SettingsState, value: unknown): SettingsAction => ({
  type: 'setSetting',
  setting,
  value,
});
