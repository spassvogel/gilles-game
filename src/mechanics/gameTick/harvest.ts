import { RESOURCE_INTERVAL } from 'constants/resources';
import { Item } from 'definitions/items/types';
import { Resource } from 'definitions/resources';
import { getDefinition, Structure } from "definitions/structures";
import { ResourceStructureDefinition, ResourceStructureLevelDefinition, StructureType } from "definitions/structures/types";
import { getTimeMultiplier, TimeType } from 'mechanics/time';
import { selectMaxResources } from 'store/selectors/resources';
import { StoreState } from "store/types";
import { ResourceStoreState } from "store/types/resources";
import { StructuresStoreState } from "store/types/structures";
import { pick } from "mechanics/lootTable";
import { ONE_MINUTE } from 'utils/format/time';


 /*
  *   */
type HarvestUpdate = {
    [key in Structure]: Item[]
}

const HARVEST_INTERVAL = ONE_MINUTE; // every minute constitutes a resource tick.


const getHarvest = (state: StoreState): HarvestUpdate|null => {
    const { lastHarvest } = state.engine;
    const structures: StructuresStoreState = state.structures;
    const result: ResourceStoreState = {};
    const timeMultiplier = getTimeMultiplier(TimeType.resourceGeneration);

    // this function can run at different intervals
    // faster or slower than once a minute
    // we will multiply the resource amount by the factor to normalize
    // const factor = ((Date.now() - lastProducedUpdate) / (RESOURCE_INTERVAL / timeMultiplier));
    // const maxResources = selectMaxResources(store);

    const handleStructure = (structure: Structure) => {
        const structureDefinition = getDefinition(structure as Structure);

        if (structureDefinition.type === StructureType.resource) {
            const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
            const level: number = structures[structure as Structure].level;
            const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

            if (Date.now() - lastHarvest > HARVEST_INTERVAL){
            if (levelDefinition.harvest?.lootTable){
                    console.log(lastHarvest, pick(levelDefinition.harvest.lootTable))
                }
            }
            // Store all the resources that this structure will generate this tick into `result`
            // Object.keys(levelDefinition.generates).reduce((accumulator: ResourceStoreState, key: string) => {
            //     const resource = key as Resource;

            //     const amount: number = levelDefinition.generates[resource]! * structures[structure as Structure].workers * factor;
            //     accumulator[resource] = (accumulator[resource] || 0) + amount;
            //     return accumulator;
            // }, result);
        }
    };


    // Calculate what each structure generates. Stores in `result`.
    Object.keys(structures).forEach((structure) => handleStructure(structure as Structure));

    // Check if the warehouse can actually hold it
    // Object.keys(result).forEach((key: string) => {
    //     const resource = key as Resource;
    //     if (result[resource]) {
    //         if (store.resources[resource]! + result[resource]! >= maxResources[resource]!) {
    //             result[resource] = maxResources[resource]! - (store.resources[resource]!);
    //         }
    //     }
    //     // console.log(`Adding: ${resource} ${result[resource]} factor ${factor}`);
    // });

    // return result;
    return null
};


export default getHarvest;
