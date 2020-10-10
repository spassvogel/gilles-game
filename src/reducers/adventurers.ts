// tslint:disable:object-literal-sort-keys
import { ActionType,
    AssignEquipmentAction,
    InventoryAction,
    MoveItemInInventoryAction,
    MoveItemToOtherAdventurerAction, RemoveEquipmentAction, RemoveItemFromInventoryAction } from "actions/adventurers";
import { EquipmentSlotType } from "components/ui/EquipmentSlot";
import { Item } from "definitions/items/types";
import { AnyAction, Reducer } from "redux";
import { AdventurerStoreState, BasicAttributesStoreState } from "stores/adventurer";
import { Trait } from 'definitions/traits/types';
import { WeaponType } from 'definitions/items/weapons';

/**
 * reducer
 * @param state
 * @param action
 */
const generateRandomAttributes = (): BasicAttributesStoreState => {
    return {
        strength: Math.floor(Math.random() * 3) + 9,
        dexterity: Math.floor(Math.random() * 3) + 9,
        intelligence: Math.floor(Math.random() * 3) + 9,
        health: Math.floor(Math.random() * 3) + 9
    };
};

const avatarImgBasePath = "img/avatars";
const spritesheetBasePath = "img/scene/actors/";

// Create a bunch of guys for debugging
const testState: AdventurerStoreState[] = [{
    id: "c4a5d270",
    equipment: {
        head: Item.cowl,
        chest: Item.chest,
        hands: Item.clothGloves,
        shoulders: Item.shoulders2,
        legs: Item.pants2,
        feet: Item.boots3,
        offHand: Item.indomitableCarapace
    },
    basicAttributes: generateRandomAttributes(),
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 6,
    room: 0,
    name: "Ximena Maddox",
    traits: [Trait.houseMaddox, Trait.gloomy],
    avatarImg: `${avatarImgBasePath}/female/f_14.png`,
    spritesheetPath: `${spritesheetBasePath}archer.json`,
    skills: {
        [WeaponType.crossbow]: 10,
        [WeaponType.bow]: 10
    },
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.deedForLumbermill, null, Item.simpleCrossbow, Item.dagger, Item.khopesh, null, Item.sword, null,  null,  null,  null,  Item.steelShield,  null,  null,  null,  null],
}, {
    id: "2e655832",
    equipment: {
        feet: Item.boots2
    },
    basicAttributes: generateRandomAttributes(),
    name: "Donte Houston",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 6,
    room: 1,
    avatarImg: `${avatarImgBasePath}/male/m_05.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    traits: [Trait.houseHouston],
    skills: {
        [WeaponType.crossbow]: 12,
        [WeaponType.staff]: 13
    },
    // tslint:disable-next-line:max-line-length
    inventory: [ Item.simpleCrossbow, null, null, null, null, Item.boots1, Item.chainmailHood, Item.nomadHelmet, Item.plateChest4, null, Item.buckler, null, null, null,  null,  null,  null,  null,  null,  null,  null,  null, Item.plateHelmet, Item.cowl],
}, {
    id: "ec6f1050",
    equipment: {
        feet: Item.boots3,
        offHand: Item.aegisOfValor
    },
    basicAttributes: generateRandomAttributes(),
    name: "Zackary 'bone bag' Morris",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 5,
    room: 2,
    traits: [Trait.gloomy],
    skills: {
        [WeaponType.sword]: 12,
        [WeaponType.hammer]: 6
    },
    avatarImg: `${avatarImgBasePath}/male/m_09.png`,
    spritesheetPath: `${spritesheetBasePath}skeleton.json`,
    inventory: [ Item.greatswordOfGwai, null, null, null, Item.berserkerShield ],
}, {
    id: "d299f98a",
    basicAttributes: generateRandomAttributes(),
    equipment: {},
    name: "Mike Keith",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 6,
    room: 4,
    avatarImg: `${avatarImgBasePath}/male/m_19.png`,
    spritesheetPath: `${spritesheetBasePath}grunt.json`,
    traits: [Trait.arrowFinder],
    skills: {
        [WeaponType.sword]: 13
    },
    inventory: [ null, null, null, null, Item.khopesh, Item.hornedHelmet, Item.woodenBulwark ],
}, {
    id: "96c686c3",
    equipment: {},
    basicAttributes: generateRandomAttributes(),
    name: "Wayne Monroe",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 4,
    room: 5,
    avatarImg: `${avatarImgBasePath}/male/m_08.png`,
    spritesheetPath: `${spritesheetBasePath}grunt.json`,
    traits: [Trait.houseMonroe, Trait.arrowFinder],
    skills: {
        [WeaponType.axe]: 12
    },
    inventory: [ null, null, null, Item.goldenShield ],
}, {
    id: "250d1a9d",
    basicAttributes: generateRandomAttributes(),
    equipment: {},
    name: "Alexis Ortiz ",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 5,
    room: 9,
    avatarImg: `${avatarImgBasePath}/female/f_10.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    inventory: [ null, null, null, null, null ],
    skills: {
        [WeaponType.axe]: 10
    },
}, {
    id: "169384ef",
    equipment: {},
    basicAttributes: generateRandomAttributes(),
    name: "Karlee Nolan",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 5,
    room: 3,
    avatarImg: `${avatarImgBasePath}/female/f_16.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
    skills: {
        [WeaponType.axe]: 10
    },
}, {
    id: "f22d66cb",
    basicAttributes: generateRandomAttributes(),
    equipment: {},
    name: "Gylbarde the Earnest",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 5,
    room: 8,
    avatarImg: `${avatarImgBasePath}/male/m_09.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    inventory: [ null, null, null, null, null ],
    skills: {
        [WeaponType.axe]: 13
    },
}, {
    id: "36c686c1",
    equipment: {},
    basicAttributes: generateRandomAttributes(),
    name: "Lanslet of the Water",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 6,

    room: 6,
    avatarImg: `${avatarImgBasePath}/male/m_26.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    inventory: [ Item.greatswordOfGwai, null, null, null, Item.shoulders1, Item.fedora, Item.greaves2 ],
    skills: {
        [WeaponType.axe]: 3
    },
}, {
    id: "12c613d4",
    equipment: {},
    basicAttributes: generateRandomAttributes(),
    name: "Tedric the Bold",
    health: Math.random() * 100,
    xp: Math.random() * 100,
    baseAP: 6,
    room: 7,
    avatarImg: `${avatarImgBasePath}/male/m_33.png`,
    spritesheetPath: `${spritesheetBasePath}footman.json`,
    inventory: [ Item.greatswordOfGwai, null, null, null ],
    skills: {
        [WeaponType.axe]: 10
    },
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

    // debug: this will auto-increase the levels of every adventurer at every tick
    // return state.map((adventurer: AdventurerStoreState) => {
    //     return {
    //         ...adventurer,
    //         xp: adventurer.xp + 1
    //     };
    // });

    return state;
};
