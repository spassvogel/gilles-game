
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { EngineStoreState } from 'store/types/engine';

// Returns the 'engine' part from redux store
export const useEngine = () => {
  return useSelector<StoreState, EngineStoreState>(store => store.engine);
};

export const useDelta = () => {
  const engine = useEngine();
  return Date.now() - engine.previousTick;
};