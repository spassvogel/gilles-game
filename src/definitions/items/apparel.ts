// tslint:disable:object-literal-sort-keys
import { Item, ItemDefinition, ItemType } from "./types";
import { EquipmentSlotType } from 'components/ui/EquipmentSlot';

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

const all: Record<string, ApparelDefinition> = {
    [Item.boots1]: {
        item: Item.boots1,
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}boots_1.png`,
    },
    [Item.boots2]: {
        item: Item.boots2,
        equipmentType: EquipmentSlotType.feet,
        itemType,
        damageReduction: 1,
        iconImg: `${basePath}boots_2.png`,
    },
    [Item.boots3]: {
        item: Item.boots3,
        equipmentType: EquipmentSlotType.feet,
        itemType,
        damageReduction: 2,
        iconImg: `${basePath}boots_3.png`,
    },
    [Item.chainmailHood]: {
        item: Item.chainmailHood,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}chainmail_hood.png`,
        damageReduction: 3,
    },
    [Item.chest]: {
        item: Item.chest,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}chest_1.png`,
        damageReduction: 2,
    },
    [Item.clothGloves]: {
        item: Item.clothGloves,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}cloth_gloves.png`,
        damageReduction: 1
    },
    [Item.cowl]: {
        item: Item.cowl,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}cowl.png`,
        damageReduction: 2,
    },
    [Item.druidChest]: {
        item: Item.druidHands,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}druid-chest.png`,
    },
    [Item.druidFeet]: {
        item: Item.druidFeet,
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}druid-feet.png`,
    },
    [Item.druidHands]: {
        item: Item.druidHands,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}druid-hands.png`,
    },
    [Item.druidHead]: {
        item: Item.druidHead,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}druid-head.png`,
    },
    [Item.druidLegs]: {
        item: Item.druidLegs,
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}druid-legs.png`,
    },
    [Item.fedora]: {
        item: Item.fedora,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}fedora.png`,
    },
    [Item.greaves1]: {
        item: Item.greaves1,
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}greaves_1.png`,
        damageReduction: 2,
    },
    [Item.greaves2]: {
        item: Item.greaves2,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}greaves_2.png`,
    },
    [Item.hornedHelmet]: {
        item: Item.hornedHelmet,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}horned_helmet.png`,
    },
    [Item.leatherGloves]: {
        item: Item.leatherGloves,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}leather_gloves.png`,
    },
    [Item.nomadHelmet]: {
        item: Item.nomadHelmet,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}nomad_helmet.png`,
    },
    [Item.pants1]: {
        item: Item.pants1,
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}pants_1.png`,
        damageReduction: 3,
    },
    [Item.pants2]: {
        item: Item.pants2,
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}pants_2.png`,
        damageReduction: 3
    },
    [Item.plateChest1]: {
        item: Item.plateChest1,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_1.png`,
    },
    [Item.plateChest2]: {
        item: Item.plateChest2,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_2.png`,
    },
    [Item.plateChest3]: {
        item: Item.plateChest3,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_3.png`,
    },
    [Item.plateChest4]: {
        item: Item.plateChest4,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_4.png`,
    },
    [Item.plateGloves1]: {
        item: Item.plateGloves1,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_1.png`,
    },
    [Item.plateGloves2]: {
        item: Item.plateGloves2,
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_2.png`,
    },
    [Item.plateHelmet]: {
        item: Item.plateHelmet,
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}plate_helmet_1.png`,
    },
    [Item.platePants]: {
        item: Item.platePants,
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}plate_pants1.png`,
    },
    [Item.plateShoulders1]: {
        item: Item.plateShoulders1,
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_1.png`,
    },
    [Item.plateShoulders2]: {
        item: Item.plateShoulders2,
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_2.png`,
    },
    [Item.robe]: {
        item: Item.robe,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}robe_1.png`,
    },
    [Item.shoulders1]: {
        item: Item.shoulders1,
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_1.png`,
    },
    [Item.shoulders2]: {
        item: Item.shoulders2,
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_2.png`,
        damageReduction: 2
    },
    [Item.shoulders3]: {
        item: Item.shoulders3,
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_3.png`,
    },
    [Item.vest]: {
        item: Item.vest,
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}vest_1.png`,
    },
};

export default all;

export function getDefinition<T extends ApparelDefinition>(apparel: string): T {
    return all[apparel] as T;
}
