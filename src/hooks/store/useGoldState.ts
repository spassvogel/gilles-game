import { StoreState } from 'stores';
import { useSelector } from 'react-redux';

// Returns the gold from redux store
const useGoldState = () => {
    return useSelector<StoreState, number>(store => store.gold);
}

export default useGoldState;