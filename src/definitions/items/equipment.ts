// tslint:disable:object-literal-sort-keys
import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.equipment;
const basePath = "/img/items/equipment/";

export enum EquipmentType {
    feet,
    hands,
    chest,
    legs,
    head,
    shoulders,
    weapon
}

export interface EquipmentDefinition extends ItemDefinition {
    equipmentType: EquipmentType;
}

const weaponDefinitions: Record<string, EquipmentDefinition> = {
    [Item.boots1]: {
        item: Item.boots1,
        equipmentType: EquipmentType.feet,
        itemType,
        subText: "These boots are made for questin'",
        iconImg: `${basePath}boots_1.png`,
    },
    [Item.boots2]: {
        item: Item.boots2,
        equipmentType: EquipmentType.feet,
        itemType,
        subText: "",
        iconImg: `${basePath}boots_2.png`,
    },
    [Item.boots3]: {
        item: Item.boots3,
        equipmentType: EquipmentType.feet,
        itemType,
        subText: "",
        iconImg: `${basePath}boots_3.png`,
    },
    [Item.chainmailHood]: {
        item: Item.chainmailHood,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}chainmail_hood.png`,
    },
    [Item.chest]: {
        item: Item.chest,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}chest_1.png`,
    },
    [Item.clothGloves]: {
        item: Item.clothGloves,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}cloth_gloves.png`,
    },
    [Item.cowl]: {
        item: Item.cowl,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}cowl.png`,
    },
    [Item.druidChest]: {
        item: Item.druidHands,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}druid-chest.png`,
    },
    [Item.druidFeet]: {
        item: Item.druidFeet,
        equipmentType: EquipmentType.feet,
        itemType,
        subText: "",
        iconImg: `${basePath}druid-feet.png`,
    },
    [Item.druidHands]: {
        item: Item.druidHands,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}druid-hands.png`,
    },
    [Item.druidHead]: {
        item: Item.druidHead,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}druid-head.png`,
    },
    [Item.druidLegs]: {
        item: Item.druidLegs,
        equipmentType: EquipmentType.legs,
        itemType,
        subText: "",
        iconImg: `${basePath}druid-legs.png`,
    },
    [Item.fedora]: {
        item: Item.fedora,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "I study the blade",
        iconImg: `${basePath}fedora.png`,
    },
    [Item.greaves1]: {
        item: Item.greaves1,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}greaves_1.png`,
    },
    [Item.greaves2]: {
        item: Item.greaves2,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}greaves_2.png`,
    },
    [Item.hornedHelmet]: {
        item: Item.hornedHelmet,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}horned_helmet.png`,
    },
    [Item.leatherGloves]: {
        item: Item.leatherGloves,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}leather_gloves.png`,
    },
    [Item.nomadHelmet]: {
        item: Item.nomadHelmet,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}nomad_helmet.png`,
    },
    [Item.pants1]: {
        item: Item.pants1,
        equipmentType: EquipmentType.legs,
        itemType,
        subText: "",
        iconImg: `${basePath}pants_1.png`,
    },
    [Item.pants2]: {
        item: Item.pants2,
        equipmentType: EquipmentType.legs,
        itemType,
        subText: "",
        iconImg: `${basePath}pants_2.png`,
    },
    [Item.plateChest1]: {
        item: Item.plateChest1,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_chest_1.png`,
    },
    [Item.plateChest2]: {
        item: Item.plateChest2,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_chest_2.png`,
    },
    [Item.plateChest3]: {
        item: Item.plateChest3,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_chest_3.png`,
    },
    [Item.plateChest4]: {
        item: Item.plateChest4,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_chest_4.png`,
    },
    [Item.plateGloves1]: {
        item: Item.plateGloves1,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_gloves_1.png`,
    },
    [Item.plateGloves2]: {
        item: Item.plateGloves2,
        equipmentType: EquipmentType.hands,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_gloves_2.png`,
    },
    [Item.plateHelmet]: {
        item: Item.plateHelmet,
        equipmentType: EquipmentType.head,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_helmet_1.png`,
    },
    [Item.platePants]: {
        item: Item.platePants,
        equipmentType: EquipmentType.legs,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_pants1.png`,
    },
    [Item.plateShoulders1]: {
        item: Item.plateShoulders1,
        equipmentType: EquipmentType.shoulders,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_shoulders_1.png`,
    },
    [Item.plateShoulders2]: {
        item: Item.plateShoulders2,
        equipmentType: EquipmentType.shoulders,
        itemType,
        subText: "",
        iconImg: `${basePath}plate_shoulders_2.png`,
    },
    [Item.robe]: {
        item: Item.robe,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}robe_1.png`,
    },
    [Item.shoulders1]: {
        item: Item.shoulders1,
        equipmentType: EquipmentType.shoulders,
        itemType,
        subText: "",
        iconImg: `${basePath}shoulders_1.png`,
    },
    [Item.shoulders2]: {
        item: Item.shoulders2,
        equipmentType: EquipmentType.shoulders,
        itemType,
        subText: "",
        iconImg: `${basePath}shoulders_2.png`,
    },
    [Item.shoulders3]: {
        item: Item.shoulders3,
        equipmentType: EquipmentType.shoulders,
        itemType,
        subText: "",
        iconImg: `${basePath}shoulders_3.png`,
    },
    [Item.vest]: {
        item: Item.vest,
        equipmentType: EquipmentType.chest,
        itemType,
        subText: "",
        iconImg: `${basePath}vest_1.png`,
    },
};

export default weaponDefinitions;
