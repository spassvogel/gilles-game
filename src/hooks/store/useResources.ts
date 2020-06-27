import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { ResourceStoreState } from 'stores/resources';

// Returns the gold from redux store
const useResources = () => {
    return useSelector<StoreState, ResourceStoreState>(store => store.resources);
}

export default useResources;