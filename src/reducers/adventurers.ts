// tslint:disable:object-literal-sort-keys
import { ActionType,
    AssignEquipmentAction,
    InventoryAction,
    MoveItemInInventoryAction,
    MoveItemToOtherAdventurerAction, RemoveEquipmentAction, RemoveItemFromInventoryAction } from "actions/adventurers";
import { EquipmentSlotType } from "components/ui/EquipmentSlot";
import { Item } from "definitions/items/types";
import { AnyAction, Reducer } from "redux";
import { AdventurerStoreState, StatsStoreState } from "stores/adventurer";

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

const avatarImgBasePath = "/img/avatars";
// Create a bunch of guys for debugging
const testState: AdventurerStoreState[] = [{
    id: "c4a5d270",
    equipment: {
        chest: Item.chest,
        head: Item.cowl,
    },
    stats: generateRandomStats(),
    health: Math.random() * 100,
    room: 0,
    name: "Ximena Maddox",
    avatarImg: `${avatarImgBasePath}/female/f_14.png`,
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.deedForLumbermill, null, Item.crossbow, Item.dagger, Item.khopesh, null, Item.sword, null,  null,  null,  null,  null,  null,  null,  null,  null],
}, {
    id: "2e655832",
    equipment: {},
    stats: generateRandomStats(),
    name: "Donte Houston",
    health: Math.random() * 100,
    room: 1,
    avatarImg: `${avatarImgBasePath}/male/m_05.png`,
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.crossbow, null, null, null, null, Item.boots1, Item.chainmailHood, Item.nomadHelmet, Item.plateChest4, null, null, null, null, null,  null,  null,  null,  null,  null,  null,  null,  null, Item.plateHelmet, Item.cowl],
}, {
    id: "ec6f1050",
    equipment: {},
    stats: generateRandomStats(),
    name: "Zackary Morris",
    health: Math.random() * 100,
    room: 2,
    avatarImg: `${avatarImgBasePath}/male/m_09.png`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}, {
    id: "d299f98a",
    stats: generateRandomStats(),
    equipment: {},
    name: "Mike Keith",
    health: Math.random() * 100,
    room: 4,
    avatarImg: `${avatarImgBasePath}/male/m_19.png`,
    inventory: [ null, null, null, null, Item.khopesh, Item.hornedHelmet ],
}, {
    id: "96c686c3",
    equipment: {},
    stats: generateRandomStats(),
    name: "Wayne Monroe",
    health: Math.random() * 100,
    room: 5,
    avatarImg: `${avatarImgBasePath}/male/m_08.png`,
    inventory: [ null, null, null ],
}, {
    id: "250d1a9d",
    stats: generateRandomStats(),
    equipment: {},
    name: "Alexis Ortiz ",
    health: Math.random() * 100,
    room: 9,
    avatarImg: `${avatarImgBasePath}/female/f_10.png`,
    inventory: [ null, null, null, null, null ],
}, {
    id: "169384ef",
    equipment: {},
    stats: generateRandomStats(),
    name: "Karlee Nolan",
    health: Math.random() * 100,
    room: 3,
    avatarImg: `${avatarImgBasePath}/female/f_16.png`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}, {
    id: "f22d66cb",
    stats: generateRandomStats(),
    equipment: {},
    name: "Gylbarde the Earnest",
    health: Math.random() * 100,
    room: 8,
    avatarImg: `${avatarImgBasePath}/male/m_09.png`,
    inventory: [ null, null, null, null, null ],
}, {
    id: "36c686c1",
    equipment: {},
    stats: generateRandomStats(),
    name: "Lanslet of the Water",
    health: Math.random() * 100,
    room: 6,
    avatarImg: `${avatarImgBasePath}/male/m_26.png`,
    inventory: [ Item.greatswordOfGwai, null, null, null, Item.shoulders1, Item.fedora, Item.greaves2 ],
}, {
    id: "12c613d4",
    equipment: {},
    stats: generateRandomStats(),
    name: "Tedric the Bold",
    health: Math.random() * 100,
    room: 7,
    avatarImg: `${avatarImgBasePath}/male/m_33.png`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
}];

// TODO: To generate a random 11 digit number, use: Math.random().toString(36).substring(2)

export const adventurers: Reducer<AdventurerStoreState[], AnyAction> = (
    state: AdventurerStoreState[] = testState, action: AnyAction) => {

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
                    if (toSlot === null || toSlot === undefined) {
                        toSlot = inventory.findIndex((val) => (val === null || val === undefined));
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

        case ActionType.assignEquipment: {
            // Assigns equipment to an adventurer
            const { equipmentSlot, item } = action as AssignEquipmentAction;
            return state.map((adventurer: AdventurerStoreState) => {
                if (adventurer.id === action.adventurerId) {
                    return {
                        ...adventurer,
                        equipment: {
                            ...adventurer.equipment,
                            [EquipmentSlotType[equipmentSlot]]: item,
                        },
                    };
                }
                return adventurer;
            });
        }

        case ActionType.removeEquipment: {
            // Assigns equipment to an adventurer
            const { equipmentSlot } = action as RemoveEquipmentAction;
            return state.map((adventurer: AdventurerStoreState) => {
                if (adventurer.id === action.adventurerId) {
                    return {
                        ...adventurer,
                        equipment: {
                            ...adventurer.equipment,
                            [EquipmentSlotType[equipmentSlot]]: null,
                        },
                    };
                }
                return adventurer;
            });
        }
    }
    return state;
};
