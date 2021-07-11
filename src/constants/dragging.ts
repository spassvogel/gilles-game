
// Things that can be dragged
export const DragType = {
    ADVENTURER: "adventurer",   // Adventurer avatar
    ITEM: "item",               // A game 'item' (equipment, etc)
};

// Source, where it comes from
export enum DragSourceType {
    adventurerInventory,
    warehouse,
    tavern,
    adventurerEquipment,
    lootCache,
    resourceStructure // harvest
}
