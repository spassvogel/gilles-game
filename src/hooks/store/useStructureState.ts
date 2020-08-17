import { useCallback } from 'react';
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { Structure } from 'definitions/structures';
import { StructureStoreState } from 'stores/structure';

// Returns the structure state from redux store
export default function useStructureState<T extends StructureStoreState>(structure: Structure): T {
    const structureSelector = useCallback(
        (state: StoreState) => state.structures[structure] as T,
        [structure]
    );
    return useSelector<StoreState, T>(structureSelector);
}
