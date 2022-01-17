import { SettingsState } from 'store/types/settings';

export type SettingsKey = keyof SettingsState;

export type SettingsAction = {
  type: 'setSetting',
  setting: SettingsKey
  value: unknown
};

export const setSetting = (setting: SettingsKey, value: unknown): SettingsAction => ({
  type: 'setSetting',
  setting,
  value,
});
