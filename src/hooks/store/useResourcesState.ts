import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { ResourceStoreState } from 'store/types/resources';

// Returns the resources from redux store
const useResourcesState = () => {
    return useSelector<StoreState, ResourceStoreState>(store => store.resources);
}

export default useResourcesState;