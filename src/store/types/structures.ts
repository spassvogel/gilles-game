import { Structure } from "definitions/structures";
import { ProductionStructureStoreState, StructureStoreState } from "./structure";

export interface StructuresStoreState {
    [Structure.alchemist]: ProductionStructureStoreState;
    [Structure.armoursmith]: ProductionStructureStoreState;
    [Structure.garden]: StructureStoreState;
    [Structure.lumberMill]: StructureStoreState;
    [Structure.mine]: StructureStoreState;
    [Structure.quarry]: StructureStoreState;
    [Structure.tavern]: StructureStoreState;
    [Structure.tannery]: StructureStoreState;
    [Structure.warehouse]: StructureStoreState;
    [Structure.weaponsmith]: ProductionStructureStoreState;
    [Structure.weaver]: StructureStoreState;
    [Structure.workshop]: ProductionStructureStoreState;
}