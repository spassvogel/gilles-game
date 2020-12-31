import { Item } from 'definitions/items/types';
import { LootCache } from 'store/types/scene';

export interface Kill10BoarsQuestVars {
    dungeon: {
        entered: boolean,
        lootCaches: {
            chest: LootCache,
            altar: LootCache,
            hallwayChest: LootCache,
        },
        situations: {
            altar: {
                candleLit: boolean
            }
        }
    }
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
            },
            altar: {
                title: "quest-kill10-boars-dungeonentrance-altar",
                items: [
                    Item.bolts,
                    Item.letters
                ]
            },
            hallwayChest: {
                title: "encounter-dungeon-caches-chest",
                items: [ Item.key ]
            }
        },
        situations: {
            altar: {
                candleLit: false
            }
        }
    }
}