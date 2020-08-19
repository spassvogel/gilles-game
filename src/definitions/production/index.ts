import weaponsmithProduction from './weaponsmith'
import armoursmithProduction from './armoursmith'
import { Structure } from 'definitions/structures';
import { Item } from 'definitions/items/types';
import { ProductionDefinition } from './types';
import workshopProduction from './workshop';
import alchemistProduction from './alchemist';

// Returns the structure that produces given Item, or null if this Item is not produced anywhere
export const getProductionStructureForItem = (item: Item): Structure | null => {
    if (alchemistProduction[item]){
        return Structure.alchemist;
    }
    if (armoursmithProduction[item]){
        return Structure.armoursmith;
    }
    if (weaponsmithProduction[item]){
        return Structure.weaponsmith;
    }
    if (workshopProduction[item]){
        return Structure.workshop;
    }
    return null;
}


const all = {
    ...alchemistProduction,
    ...armoursmithProduction,
    ...weaponsmithProduction,
    ...workshopProduction
};

export const getDefinition = (item: Item): ProductionDefinition => {
    return all[item];
}


