import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { SettingsState } from 'store/types/settings';

export const useSettings = () => {
  return useSelector<StoreState, SettingsState>(state => state.settings);
};
