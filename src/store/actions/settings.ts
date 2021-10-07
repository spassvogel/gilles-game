export type SettingsAction = {
  type: "setVerboseCombatLog",
  enabled: boolean
}

export const setVerboseCombatLog = (enabled: boolean): SettingsAction => ({
  type: "setVerboseCombatLog",
  enabled,
});
