import { AdventurerAction } from "store/actions/adventurers";
import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Reducer } from "redux";
import { AdventurerColor, AdventurerStoreState, BasicAttributesStoreState } from "store/types/adventurer";
import { Trait } from 'definitions/traits/types';
import { WeaponType } from 'definitions/items/weapons';
import { levelToXp } from "mechanics/adventurers/levels";
import { Action } from "store/actions";
import { getDefinition, isConsumable } from "definitions/items/consumables";
import { Item } from "definitions/items/types";

/**
 * reducer
 * @param state
 * @param action
 */
const generateRandomAttributes = (): BasicAttributesStoreState => {
  return {
    str: Math.floor(Math.random() * 3) + 9,
    for: Math.floor(Math.random() * 3) + 9,
    int: Math.floor(Math.random() * 3) + 9,
    agi: Math.floor(Math.random() * 3) + 9
  };
};

const avatarImgBasePath = "/img/avatars";
const spritesheetBasePath = "img/scene/actors/";

// offHand]: Item.indomitableCarapace

// Create a bunch of guys for debugging
export const initialAdventurers: AdventurerStoreState[] = [{
  id: "c4a5d270",
  equipment: {
    [EquipmentSlotType.head]: { type: "apparel/cowl", durability: 0.25 },
    [EquipmentSlotType.chest]: { type: "apparel/chest", durability: 0.5 },
    [EquipmentSlotType.hands]: { type: "apparel/clothGloves" },
    [EquipmentSlotType.shoulders]: { type: "apparel/shoulders2" },
    [EquipmentSlotType.legs]: { type: "apparel/pants2" },
    [EquipmentSlotType.feet]: { type: "apparel/boots3" },
    [EquipmentSlotType.mainHand]: { type: "weapon/longbow" },
    [EquipmentSlotType.offHand]: { type: "ammunition/basicArrows", quantity: 200 }
    // offHand: Item.indomitableCarapace
  },
  basicAttributes: generateRandomAttributes(),
  health: Math.random() * 100,
  xp: levelToXp(1),

  room: 0,
  name: "Sasha Falcon",
  flavor: true,
  traits: [Trait.houseMaddox, Trait.gloomy],
  avatarImg: `${avatarImgBasePath}/female/f_14.png`,
  spritesheetPath: `${spritesheetBasePath}elf-bow.json`,
  color: AdventurerColor.purple,
  skills: {
    [WeaponType.crossbow]: 10,
    [WeaponType.bow]: 10
  },
  effects: [],
  inventory: [ { type: "deed/lumbermill" }, null, { type: "weapon/simpleCrossbow" }, { type: "weapon/dagger" }, { type: "weapon/khopesh" }, null, { type: "weapon/steelSword" }, null,  { type: "consumable/greaterManaPotion" },  { type: "consumable/majorHealthPotion" },  null,  { type: "weapon/steelShield" },  null,  null,  null,  null],
}, {
  id: "2e655832",
  equipment: {
    [EquipmentSlotType.feet]: { type: "apparel/boots2" },
    [EquipmentSlotType.mainHand]: { type: "weapon/simpleCrossbow" },
    [EquipmentSlotType.offHand]: { type: "ammunition/crossbowBolts", quantity: 150 }
  },
  basicAttributes: generateRandomAttributes(),
  name: "Addison Chilson",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 1,
  avatarImg: `${avatarImgBasePath}/male/m_05.png`,
  spritesheetPath: `${spritesheetBasePath}elf-bow.json`,
  color: AdventurerColor.teal,
  traits: [Trait.houseHouston],
  skills: {
    [WeaponType.crossbow]: 12,
    [WeaponType.staff]: 13
  },
  effects: [],
  inventory: [ { type: "weapon/simpleCrossbow" }, null, { type: "consumable/greaterSoma" }, null, null, null, { type: "apparel/boots1" }, { type: "apparel/chainmailHood"} , { type: "apparel/nomadHelmet" }, { type: "apparel/plateChest4" }, null, { type: "weapon/buckler" }, null, null, null,  null,  null,  null,  null,  null,  null,  null,  null, { type: "apparel/plateHelmet" }, { type: "apparel/cowl" }]
}, {
  id: "ec6f1050",
  equipment: {
    [EquipmentSlotType.feet]: { type: "apparel/boots3" },
    [EquipmentSlotType.mainHand]: { type: "weapon/warhammer" }
    // offHand: Item.aegisOfValor
  },
  basicAttributes: generateRandomAttributes(),
  name: "Zackary 'bone bag' Morris",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 2,
  traits: [Trait.gloomy],
  skills: {
    [WeaponType.sword]: 12,
    [WeaponType.hammer]: 6
  },
  avatarImg: `${avatarImgBasePath}/male/m_09.png`,
  spritesheetPath: `${spritesheetBasePath}skeleton.json`,
  color: AdventurerColor.black,
  effects: [],
  inventory: [{ type: "weapon/greatswordOfGwai" }, null, null, null, { type: "weapon/berserkerShield" }],
}, {
  id: "d299f98a",
  basicAttributes: generateRandomAttributes(),
  equipment: {
    [EquipmentSlotType.mainHand]: { type: "weapon/steelSword" }
  },
  name: "Mike Keith",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 4,
  avatarImg: `${avatarImgBasePath}/male/m_19.png`,
  spritesheetPath: `${spritesheetBasePath}knight-sword.json`,
  traits: [Trait.arrowFinder],
  skills: {
    [WeaponType.sword]: 13
  },
  effects: [],
  inventory: [ null, null, null, null, { type: "weapon/khopesh" }, { type: "apparel/hornedHelmet" }, { type: "weapon/woodenBulwark"} ],
}, {
  id: "96c686c3",
  equipment: {},
  basicAttributes: generateRandomAttributes(),
  name: "Wayne Monroe",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 5,
  avatarImg: `${avatarImgBasePath}/male/m_08.png`,
  spritesheetPath: `${spritesheetBasePath}orc-axe.json`,
  traits: [Trait.houseMonroe, Trait.arrowFinder],
  skills: {
    [WeaponType.axe]: 12
  },
  effects: [],
  inventory: [ null, null, null, { type: "weapon/goldenShield" }],
}, {
  id: "250d1a9d",
  basicAttributes: generateRandomAttributes(),
  name: "Alexis Ortiz ",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 9,
  avatarImg: `${avatarImgBasePath}/female/f_10.png`,
  spritesheetPath: `${spritesheetBasePath}knight-sword.json`,
  inventory: [ null, null, null, null, null ],
  skills: {
    [WeaponType.axe]: 10
  },
  equipment: {
    [EquipmentSlotType.mainHand]: { type: "weapon/longbow" },
    [EquipmentSlotType.offHand]: { type: "ammunition/basicArrows", quantity: 50 }
  },
  effects: []
}, {
  id: "169384ef",
  basicAttributes: generateRandomAttributes(),
  name: "Karlee Nolan",
  flavor: true,
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 3,
  avatarImg: `${avatarImgBasePath}/female/f_16.png`,
  spritesheetPath: `${spritesheetBasePath}troll-sword.json`,
  inventory: [ { type: "weapon/greatswordOfGwai" }, null, null, null ],
  skills: {
    [WeaponType.axe]: 10
  },
  equipment: {
    [EquipmentSlotType.mainHand]: { type: "weapon/simpleCrossbow" },
    [EquipmentSlotType.offHand]: { type: "ammunition/crossbowBolts", quantity: 40 }
  },
  effects: []
}, {
  id: "f22d66cb",
  basicAttributes: generateRandomAttributes(),
  equipment: {},
  name: "Gylbarde the Earnest",
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 8,
  avatarImg: `${avatarImgBasePath}/male/m_09.png`,
  spritesheetPath: `${spritesheetBasePath}knight-sword.json`,
  inventory: [ null, null, null, null, null ],
  skills: {
    [WeaponType.axe]: 13
  },
  effects: []
}, {
  id: "36c686c1",
  equipment: {},
  basicAttributes: generateRandomAttributes(),
  name: "Lanslet of the Water",
  health: Math.random() * 100,
  xp: Math.random() * 100,


  room: 6,
  avatarImg: `${avatarImgBasePath}/male/m_26.png`,
  spritesheetPath: `${spritesheetBasePath}knight-sword.json`,
  inventory: [ { type: "weapon/greatswordOfGwai" }, null, null, null, { type: "apparel/shoulders1" }, { type: "apparel/fedora" }, { type: "apparel/greaves2" }],
  skills: {
    [WeaponType.axe]: 3
  },
  effects: []
}, {
  id: "12c613d4",
  equipment: {},
  basicAttributes: generateRandomAttributes(),
  name: "Tedric the Bold",
  health: Math.random() * 100,
  xp: Math.random() * 100,

  room: 7,
  avatarImg: `${avatarImgBasePath}/male/m_33.png`,
  spritesheetPath: `${spritesheetBasePath}knight-sword.json`,
  inventory: [ { type: "weapon/greatswordOfGwai" }, null, null, null ],
  skills: {
    [WeaponType.axe]: 10
  },
  effects: []
}];

// TODO: To generate a random 11 digit number, use: Math.random().toString(36).substring(2)

export const adventurers: Reducer<AdventurerStoreState[], AdventurerAction> = (state: AdventurerStoreState[] = initialAdventurers, action: Action) => {

  switch (action.type) {
    // Moves an  item from one inventory slot to another
    case "consumeItem": {
      const { adventurerId, fromSlot } = action;
      const adventurer = state.find((a) => a.id === adventurerId);
      if (!adventurer) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
      let { health } = adventurer;
      const consumable = adventurer.inventory[fromSlot];
      if (!consumable || !isConsumable(consumable.type)) {
        throw new Error(`No potion found at index ${fromSlot} `)
      }
      const definition = getDefinition(consumable.type);
      // todo: 2021-09-02 Drink potions
      switch (definition.category) {
        case "health":
          health = Math.min((definition.effect ?? 0) + health, 100);
          break;
        case "soma":
          console.log(`${adventurer.name} drinks a soma potion`);
          break;
        case "mana":
          console.log(`${adventurer.name} drinks a mana potion`);
          break;
      }

      // take item from the inventory
      const inventory = adventurer.inventory.map((element, index) => index !== fromSlot ? element : null);
      return state.map((element: AdventurerStoreState) => {
        if (element === adventurer) {
          return {
            ...element,
            health,
            inventory,
          };
        }
        return element;
      });
    }
    // Moves an  item from one inventory slot to another
    case "moveItemInInventory": {
      const { adventurerId, fromSlot, toSlot } = action;
      const adventurer = state.find((a) => a.id === adventurerId);
      if (!adventurer) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
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

    case "moveItemToOtherAdventurer": {
      // Moves an item from one adventurer to another
      const { adventurerId: fromAdventurerId, fromSlot, toAdventurerId } = action;
      const fromAdventurer = state.find((a) => a.id === fromAdventurerId);
      if (!fromAdventurer) return state
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

    case "addItemToInventory": {
      const { item } = action;
      let { toSlot } = action;

      return state.map((element: AdventurerStoreState) => {
        if (element.id === action.adventurerId) {
          const inventory = element.inventory.concat();
          if (toSlot === null || toSlot === undefined) {
            toSlot = inventory.findIndex((val) => (val === null || val === undefined));
          }
          inventory[toSlot] = item;
          // todo: check if no space
          return {
            ...element,
            inventory,
          };
        }
        return element;
      });
    }

    case "removeItemFromInventory": {
      const { fromSlot } = action;

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


    case "changeItemQuantity": {
      // Change quantity of an item in invntory
      const { slot, quantity } = action;

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          const inventory = adventurer.inventory.map((item, index) => index !== slot ? item : ({
            ...item,
            quantity
          }) as Item);
          return {
            ...adventurer,
            inventory,
          };
        }
        return adventurer;
      });
    }

    case "assignEquipment": {
      // Assigns equipment to an adventurer
      const { equipmentSlot, item, } = action;
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: item,
            },
          };
        }
        return adventurer;
      });
    }

    case "removeEquipment": {
      // Assigns equipment to an adventurer
      const { equipmentSlot } = action;

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: null,
            },
          };
        }
        return adventurer;
      });
    }

    case "changeEquipmentQuantity": {
      // Change quantity of an item equipped
      const { equipmentSlot, quantity } = action;

      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            equipment: {
              ...adventurer.equipment,
              [equipmentSlot]: {
                ...adventurer.equipment[equipmentSlot],
                quantity
              },
            },
          };
        }
        return adventurer;
      });
    }

    case "renameAdventurer": {
      // Rename adventurer
      const { name } = action;
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            name
          };
        }
        return adventurer;
      });
    }
    case "addXP": {
      // Adds xp
      const { xp } = action;
      return state.map((adventurer: AdventurerStoreState) => {
        if (adventurer.id === action.adventurerId) {
          return {
            ...adventurer,
            xp: adventurer.xp + xp
          };
        }
        return adventurer;
      });
    }

  }
  return state
  // debug: this will auto-increase the levels of every adventurer at every tick
  // return state.map((adventurer: AdventurerStoreState) => {
  //   return {
  //     ...adventurer,
  //     xp: adventurer.xp + 1
  //   };
  // });
};
