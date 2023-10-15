import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import { type SettingsState } from 'store/types/settings'

export const useSettings = () => {
  return useSelector<StoreState, SettingsState>(state => state.settings)
}
