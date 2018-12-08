// tslint:disable:object-literal-sort-keys

import { Reducer } from "redux";
import { Action, ActionType, MoveItemInInventoryAction, MoveItemInToOtherAdventurerAction } from "src/actions/adventurers";
import { Equipment } from "src/definitions/equipment/types";
import { AdventurerStoreState, GearStoreState, StatsStoreState } from "src/stores/adventurer";
import * as uuid from "uuid/v1";

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

const generateRandomGear = (): GearStoreState => {

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
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Ximena Maddox",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`,
    // tslint:disable-next-line:max-line-length
    inventory: [ null, null, Equipment.crossbow, Equipment.dagger, Equipment.khopesh, null, Equipment.sword, null,  null,  null,  null,  null,  null,  null,  null,  null, ],
}, {
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Donte Houston",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`,
    inventory: [ Equipment.crossbow, null, null, null, null, null, null, null, null, null, null, null,  null,  null,  null,  null,  null,  null,  null,  null, ],
}, {
    id: uuid(),
    gear: generateRandomGear(),
    stats: generateRandomStats(),
    name: "Zackary Morris",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`,
    inventory: [ null, null, null, null ],
}, {
    id: uuid(),
    stats: generateRandomStats(),
    gear: generateRandomGear(),
    name: "Mike Keith",
    avatarImg: `/img/avatars/andy-victorovych-a${ Math.floor(Math.random() * 14) + 1}.jpg`,
    inventory: [ null, null, null, null, null ],
}];

export const adventurers: Reducer<AdventurerStoreState[]> = (
    state: AdventurerStoreState[] = testState, action: Action) => {

    switch (action.type) {
        // Moves an  equipment item from one inventory slot to another
        case ActionType.moveItemInInventory: {
            const {
                adventurerId,
                fromSlot,
                toSlot,
            } = (action as MoveItemInInventoryAction);
            const adventurer = state.find((a) => a.id === adventurerId)!;
            const inventory = adventurer.inventory.map((element, index) => {
                if (index === fromSlot) { return null; }
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
            const {
                adventurerId: fromAdventurerId,
                fromSlot,
                toAdventurerId,
            } = (action as MoveItemInToOtherAdventurerAction);

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
    }
    return state;
};
