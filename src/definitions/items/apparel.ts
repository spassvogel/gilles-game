import { Item, ItemDefinition, ItemType } from "./types";
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';

type Prefix = "apparel/";
const PREFIX = "apparel/";
const itemType = ItemType.apparel;
const basePath = "/img/items/apparel/";

// export enum EquipmentSlotType {
//     feet,
//     hands,
//     chest,
//     legs,
//     head,
//     shoulders,
// }

export interface ApparelDefinition extends ItemDefinition {
    equipmentType: EquipmentSlotType;
    damageReduction?: number;
}

const apparel = {
    boots1: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}boots_1.png`,
    },
    boots2: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        damageReduction: 1,
        iconImg: `${basePath}boots_2.png`,
    },
    boots3: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        damageReduction: 2,
        iconImg: `${basePath}boots_3.png`,
    },
    chainmailHood: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}chainmail_hood.png`,
        damageReduction: 3,
    },
    chest: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}chest_1.png`,
        damageReduction: 2,
    },
    clothGloves: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}cloth_gloves.png`,
        damageReduction: 1
    },
    cowl: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}cowl.png`,
        damageReduction: 2,
    },
    druidChest: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}druid-chest.png`,
    },
    druidFeet: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}druid-feet.png`,
    },
    druidHands: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}druid-hands.png`,
    },
    druidHead: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}druid-head.png`,
    },
    druidLegs: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}druid-legs.png`,
    },
    fedora: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}fedora.png`,
    },
    greaves1: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}greaves_1.png`,
        damageReduction: 2,
    },
    greaves2: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}greaves_2.png`,
    },
    hornedHelmet: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}horned_helmet.png`,
    },
    leatherGloves: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}leather_gloves.png`,
    },
    nomadHelmet: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}nomad_helmet.png`,
    },
    pants1: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}pants_1.png`,
        damageReduction: 3,
    },
    pants2: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}pants_2.png`,
        damageReduction: 3
    },
    plateChest1: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_1.png`,
    },
    plateChest2: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_2.png`,
    },
    plateChest3: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_3.png`,
    },
    plateChest4: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_4.png`,
    },
    plateGloves1: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_1.png`,
    },
    plateGloves2: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_2.png`,
    },
    plateHelmet: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}plate_helmet_1.png`,
    },
    platePants: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}plate_pants1.png`,
    },
    plateShoulders1: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_1.png`,
    },
    plateShoulders2: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_2.png`,
    },
    robe: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}robe_1.png`,
    },
    shoulders1: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_1.png`,
    },
    shoulders2: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_2.png`,
        damageReduction: 2
    },
    shoulders3: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_3.png`,
    },
    vest: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}vest_1.png`,
    },
};

export type Apparel = `${Prefix}${keyof typeof apparel}`;
const all = Object.entries(apparel).reduce<{[key: string]: ApparelDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<Apparel, ApparelDefinition>;
export default all;

export function getDefinition(apparel: Apparel): ApparelDefinition {
    return all[apparel];
}

export const isApparel = (item: Item): item is Apparel => {
    return !!all[item as Apparel];
}