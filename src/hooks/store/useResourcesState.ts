import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { ResourceStoreState } from 'stores/resources';

// Returns the resources from redux store
const useResourcesState = () => {
    return useSelector<StoreState, ResourceStoreState>(store => store.resources);
}

export default useResourcesState;