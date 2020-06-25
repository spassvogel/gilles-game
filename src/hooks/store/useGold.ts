import { StoreState } from 'stores';
import { useSelector } from 'react-redux';

// Returns the gold from redux store
const useGold = () => {
    return useSelector<StoreState, number>(store => store.gold);
}

export default useGold;