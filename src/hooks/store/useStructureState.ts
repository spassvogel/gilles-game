import { useCallback } from 'react';
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { Structure } from 'definitions/structures';
import { StructureStoreState } from 'store/types/structure';

// Returns the structure state from redux store
export default function useStructureState<T extends StructureStoreState>(structure: Structure): T {
    const structureSelector = useCallback(
        (state: StoreState) => state.structures[structure] as T,
        [structure]
    );
    return useSelector<StoreState, T>(structureSelector);
}
