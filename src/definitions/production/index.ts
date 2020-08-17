import {  getDefinition as weaponsmithProduction} from './weaponsmith'
import { Structure } from 'definitions/structures';
import { Item } from 'definitions/items/types';
import { ProductionDefinition } from './types';

// Returns the structure that produces given Item, or null if this Item is not produced anywhere
export const getProductionStructureForItem = (item: Item): Structure | null => {
    if (weaponsmithProduction(item)){
        return Structure.weaponsmith;
    }
    return null;
}


const all = {
    ...weaponsmithProduction,
};

export const getDefinition = (item: Item): ProductionDefinition => {
    return all[item];
}


