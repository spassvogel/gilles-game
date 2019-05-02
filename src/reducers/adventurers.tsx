// tslint:disable:object-literal-sort-keys

import { Reducer } from "redux";
import { Action, ActionType,
    InventoryAction, MoveItemInInventoryAction, MoveItemToOtherAdventurerAction, RemoveItemFromInventoryAction } from "src/actions/adventurers";
import { Item } from "src/definitions/items/types";
import { AdventurerStoreState, EquipmentStoreState, StatsStoreState } from "src/stores/adventurer";

/**
 * reducer
 * @param state
 * @param action
 */

const generateRandomStats = (): StatsStoreState => {
    return {
        strength: Math.random() * 100,
        perception: Math.random() * 100,
        endurance: Math.random() * 100,
        charisma: Math.random() * 100,
        intelligenge: Math.random() * 100,
        agility: Math.random() * 100,
        luck: Math.random() * 100,
    };
};

const generateRandomGear = (): EquipmentStoreState => {

    const second = ["Burning Damnation",
        "Fury", "Some old guy", "the Depths", "Frozen Hells",
        "Broken bones", "the Claw", "Resilience", "Shattered Damnation", "the Seer" ];
    const combine = (first: string[]): string => {
        const firstPart = first[Math.floor(Math.random() * first.length)];
        const secondPart = second[Math.floor(Math.random() * second.length)];
        return `${firstPart} of ${secondPart}`;
    };
    return {
        arms: combine(["Fists", "Grips", "Hands", "Handguards", "Gauntlets"]),
        body: combine(["Breastplate", "Mithril Vest", "Titanium Armor", "Primitive Armor", "Scaled Raiment"]),
        feet: combine(["Sabatons", "Footguards", "Warboots", "Slippers"]),
        head: combine(["Helmet", "Headguard", "Obsidian Crown", "Scaled Hood"]),
    };

};

const testState: AdventurerStoreState[] = [{
    id: "c4a5d270",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Ximena Maddox",
    avatarImg: `/img/avatars/andy-victorovych-a1.jpg`,
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.deedForLumbermill, null, Item.crossbow, Item.dagger, Item.khopesh, null, Item.sword, null,  null,  null,  null,  null,  null,  null,  null,  null],
}, {
    id: "2e655832-65c9-484d-81d7-07938253cf4d",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Donte Houston",
    avatarImg: `/img/avatars/andy-victorovych-a2.jpg`,
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.crossbow, null, null, null, null, null, null, null, null, null, null, null,  null,  null,  null,  null,  null,  null,  null,  null],
}, {
    id: "ec6f1050-11e7-11e9-b13b-654a21c6ca63",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Zackary Morris",
    avatarImg: `/img/avatars/andy-victorovych-a3.jpg`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}, {
    id: "d299f98a-8f30-4684-b4b5-81baadb388b2",
    stats: generateRandomStats(),
    equipment: generateRandomGear(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a4.jpg`,
    inventory: [ null, null, null, null, null ],
}, {
    id: "96c686c3",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Wayne Monroe",
    avatarImg: `/img/avatars/andy-victorovych-a5.jpg`,
    inventory: [ null, null, null ],
}, {
    id: "250d1a9d",
    stats: generateRandomStats(),
    equipment: generateRandomGear(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a6.jpg`,
    inventory: [ null, null, null, null, null ],
}, {
    id: "169384ef",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Karlee Nolan",
    avatarImg: `/img/avatars/andy-victorovych-a7.jpg`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}, {
    id: "f22d66cb",
    stats: generateRandomStats(),
    equipment: generateRandomGear(),
    name: "Keyon Hickman",
    avatarImg: `/img/avatars/andy-victorovych-a8.jpg`,
    inventory: [ null, null, null, null, null ],
}, {
    id: "36c686c1",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "",
    avatarImg: `/img/avatars/andy-victorovych-a9.jpg`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}, {
    id: "12c613d4",
    equipment: generateRandomGear(),
    stats: generateRandomStats(),
    name: "",
    avatarImg: `/img/avatars/andy-victorovych-a10.jpg`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}];

// TODO: To generate a random 11 digit number, use: Math.random().toString(36).substring(2)

export const adventurers: Reducer<AdventurerStoreState[]> = (
    state: AdventurerStoreState[] = testState, action: Action) => {

    switch (action.type) {
        // Moves an  item from one inventory slot to another
        case ActionType.moveItemInInventory: {
            const {
                adventurerId,
                fromSlot,
                toSlot,
            } = (action as MoveItemInInventoryAction);
            const adventurer = state.find((a) => a.id === adventurerId)!;
            const inventory = adventurer.inventory.map((element, index) => {
                if (index === fromSlot) { return adventurer.inventory[toSlot]; }
                if (index === toSlot) { return adventurer.inventory[fromSlot]; }
                return element;
            });

            return state.map((element: AdventurerStoreState) => {
                if (element === adventurer) {
                    return {
                        ...element,
                        inventory,
                    };
                }
                return element;
            });
        }

        case ActionType.moveItemToOtherAdventurer: {
            // Moves an item from one adventurer to another
            const {
                adventurerId: fromAdventurerId,
                fromSlot,
                toAdventurerId,
            } = (action as MoveItemToOtherAdventurerAction);

            const fromAdventurer = state.find((a) => a.id === fromAdventurerId)!;
            const item = fromAdventurer.inventory[fromSlot];

            return state.map((element: AdventurerStoreState) => {
                if (element.id === fromAdventurerId) {
                    // Clear out the item from this adventurer
                    const inventory = element.inventory.concat();
                    inventory[fromSlot] = null;
                    return {
                        ...element,
                        inventory,
                    };
                } else if (element.id === toAdventurerId) {
                    // Find first empty slot, add there
                    const inventory = element.inventory.concat();
                    const index = inventory.findIndex((slot) => slot === null);
                    inventory[index] = item;
                    // todo: what if there is no room?
                    return {
                        ...element,
                        inventory,
                    };
                }
                return element;
            });
        }

        case ActionType.addItemToInventory: {
            const { item } = action as InventoryAction;

            return state.map((element: AdventurerStoreState) => {
                if (element.id === action.adventurerId) {
                    const inventory = element.inventory.concat();
                    let toSlot = (action as InventoryAction).toSlot;
                    if (toSlot === null) {
                        toSlot = inventory.findIndex((val) => val === null || val === undefined);
                    }
                    inventory[toSlot!] = item;
                    // todo: check if no space
                    return {
                        ...element,
                        inventory,
                    };
                }
                return element;
            });
        }

        case ActionType.removeItemFromInventory: {
            const { fromSlot } = action as RemoveItemFromInventoryAction;

            return state.map((adventurer: AdventurerStoreState) => {
                if (adventurer.id === action.adventurerId) {
                    const inventory = adventurer.inventory.map((element, index) => index !== fromSlot ? element : null);
                    return {
                        ...adventurer,
                        inventory,
                    };
                }
                return adventurer;
            });
        }
    }
    return state;
};
