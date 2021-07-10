import { ResourceStructure, Structure } from "definitions/structures";
import { ProductionStructureStoreState, ResourceStructureState, StructureStoreState } from "./structure";

export interface StructuresStoreState {
    [Structure.alchemist]: ProductionStructureStoreState;
    [Structure.armoursmith]: ProductionStructureStoreState;
    [Structure.garden]: ResourceStructureState;
    [Structure.lumberMill]: ResourceStructureState;
    [Structure.mine]: ResourceStructureState;
    [Structure.quarry]: ResourceStructureState;
    [Structure.tavern]: StructureStoreState;
    [Structure.tannery]: ResourceStructureState;
    [Structure.warehouse]: StructureStoreState;
    [Structure.weaponsmith]: ProductionStructureStoreState;
    [Structure.weaver]: ResourceStructureState;
    [Structure.workshop]: ProductionStructureStoreState;
}

// todo: 2021-07-10 refactor using types. 

// Type guard
export const isProductionStructure = (structure: Structure) => {
    return structure === Structure.alchemist ||
        structure === Structure.armoursmith ||
        structure === Structure.weaponsmith ||
        structure === Structure.workshop;
}
// Type guard
export const isResourceStructure = (structure: Structure) => {
    return structure === Structure.garden ||
        structure === Structure.lumberMill ||
        structure === Structure.mine ||
        structure === Structure.quarry ||
        structure === Structure.tannery ||
        structure === Structure.weaver;
}