import { Item } from 'definitions/items/types';
import { LootCache } from 'stores/scene';

export interface Kill10BoarsQuestVars {
    dungeon: {
        entered: boolean,
        lootCaches: {
            chest: LootCache
        }
    },
    foo: boolean;
    bar: number;
}

export const initialQuestVars: Kill10BoarsQuestVars = {
    dungeon: {
        entered: false,
        lootCaches: {
            chest: {
                title: "encounter-dungeon-caches-chest",
                items: [
                    Item.nomadHelmet,
                    Item.teeth,
                    Item.poisonVial,
                    Item.fedora,
                ],
                gold: 100
            }
        }
    },
    foo: false,
    bar: 3
}