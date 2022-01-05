import { ItemType } from 'definitions/items/types';
import { getDefinition, Structure } from 'definitions/structures';
import { ResourceStructureDefinition, ResourceStructureLevelDefinition, StructureType } from 'definitions/structures/types';
import { StoreState } from 'store/types';
import { StructuresStoreState } from 'store/types/structures';
import { pick } from 'mechanics/lootTable';
import { ONE_HOUR } from 'utils/format/time';
import { ResourceStructureState } from 'store/types/structure';


/*
  * Items to be harvested  */
export type HarvestUpdate = {
  [key in Structure]?: ItemType[]
};

export const HARVEST_INTERVAL = ONE_HOUR * 3; // every three hours constitutes a harvest tick.


const getHarvest = (state: StoreState): HarvestUpdate | null => {
  const { lastHarvest } = state.engine;
  const structures: StructuresStoreState = state.structures;
  const result: HarvestUpdate = {};

  const handleStructure = (structure: Structure) => {
    const structureDefinition = getDefinition(structure);

    if (structureDefinition.type === StructureType.resource) {
      const resourceStructureDefinition = structureDefinition as ResourceStructureDefinition;
      const level: number = structures[structure as Structure].level;
      const levelDefinition: ResourceStructureLevelDefinition = resourceStructureDefinition.levels[level];

      if (levelDefinition.harvest?.lootTable){
        const structureState = structures[structure] as ResourceStructureState;
        let itemCount = structureState.harvest?.length ?? 0;
        const items: ItemType[] = [];
        while (itemCount < levelDefinition.harvest.amount) {
          items.push(pick(levelDefinition.harvest.lootTable));
          itemCount ++;
        }

        result[structure] = items;
      }

    }
  };


  // Calculate what each structure generates. Stores in `result`.
  if (Date.now() - lastHarvest > HARVEST_INTERVAL){
    Object.keys(structures).forEach((structure) => handleStructure(structure as Structure));
  }
  return result;
};


export default getHarvest;
