import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { Item } from 'definitions/items/types';

// Returns the items from the warehouse
const useStockpileState = () => {
    return useSelector<StoreState, (Item|null)[]>(store => store.stockpile);
}

export default useStockpileState;