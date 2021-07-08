import { Item } from 'definitions/items/types';
import { getDefinition, Structure } from "definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition, StructureType } from "definitions/structures/types";
import { getTimeMultiplier, TimeType } from 'mechanics/time';
import { StoreState } from "store/types";
import { StructuresStoreState } from "store/types/structures";
import { pick } from "mechanics/lootTable";
import { ONE_MINUTE } from 'utils/format/time';
import { ResourceStructureState } from 'store/types/structure';


 /*
  *   */
export type HarvestUpdate = {
    [key in Structure]?: Item[]
}

const HARVEST_INTERVAL = ONE_MINUTE; // every minute constitutes a resource tick.


const getHarvest = (state: StoreState): HarvestUpdate|null => {
    const { lastHarvest } = state.engine;
    const structures: StructuresStoreState = state.structures;
    const result: HarvestUpdate = {};
    const timeMultiplier = getTimeMultiplier(TimeType.resourceGeneration);


    const handleStructure = (structure: Structure) => {
        const structureDefinition = getDefinition(structure);

        if (structureDefinition.type === StructureType.resource) {
            const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
            const level: number = structures[structure as Structure].level;
            const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];
            
            if (Date.now() - lastHarvest > HARVEST_INTERVAL){
                if (levelDefinition.harvest?.lootTable){
                    const state = structures[structure] as ResourceStructureState;
                    let itemCount = state.harvest?.length ?? 0;
                    const items: Item[] = [];
                    while (itemCount < levelDefinition.harvest.amount) {
                        items.push(pick(levelDefinition.harvest.lootTable))
                        itemCount ++;
                    }

                    result[structure] = items
                }
            }
        }
    };


    // Calculate what each structure generates. Stores in `result`.
    Object.keys(structures).forEach((structure) => handleStructure(structure as Structure));

    return result;
};


export default getHarvest;
