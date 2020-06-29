import { useCallback } from 'react';
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { Structure } from 'definitions/structures';
import { StructureStoreState } from 'stores/structure';

// Returns the structure state from redux store
// todo: rename to `useStructureState`
const useStructure = (structure: Structure) => {
    const structureSelector = useCallback(
        (state: StoreState) => state.structures[structure],
        [structure]
    );
    return useSelector<StoreState, StructureStoreState>(structureSelector);
}

export default useStructure;