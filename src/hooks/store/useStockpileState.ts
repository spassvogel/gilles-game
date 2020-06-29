import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { Item } from 'definitions/items/types';

// Returns the gold from redux store
const useStockpileState = () => {
    return useSelector<StoreState, (Item|null)[]>(store => store.stockpile);
}

export default useStockpileState;