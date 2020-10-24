import { getDefinition, Structure } from "definitions/structures";
import { WarehouseStructureDefinition, WarehouseStructureLevelDefinition } from "definitions/structures/types";
import { createSelector } from 'reselect';
import { StoreState } from "store/types";

const getWarehouseLevel = (state: StoreState) => {
    return state.structures[Structure.warehouse].level;
}


const maxResources = (level: number) => {
    const structureDefinition = getDefinition<WarehouseStructureDefinition>(Structure.warehouse);
    const levelDefinition: WarehouseStructureLevelDefinition = structureDefinition.levels[level];
    return levelDefinition.maxResources;
}

// Selects a ResourceStoreState with maximum stockpile of each resource the warehouse supports
export const selectMaxResources = createSelector([
    getWarehouseLevel],
    maxResources,
);