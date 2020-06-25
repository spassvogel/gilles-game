// tslint:disable:object-literal-sort-keys
import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.apparel;
const basePath = "/img/items/apparel/";

export enum ApparelType {
    feet,
    hands,
    chest,
    legs,
    head,
    shoulders,
}

export interface ApparelDefinition extends ItemDefinition {
    equipmentType: ApparelType;
    armourRating?: number;
}

const all: Record<string, ApparelDefinition> = {
    [Item.boots1]: {
        item: Item.boots1,
        equipmentType: ApparelType.feet,
        itemType,
        iconImg: `${basePath}boots_1.png`,
    },
    [Item.boots2]: {
        item: Item.boots2,
        equipmentType: ApparelType.feet,
        itemType,
        iconImg: `${basePath}boots_2.png`,
    },
    [Item.boots3]: {
        item: Item.boots3,
        equipmentType: ApparelType.feet,
        itemType,
        iconImg: `${basePath}boots_3.png`,
    },
    [Item.chainmailHood]: {
        item: Item.chainmailHood,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}chainmail_hood.png`,
        armourRating: 3,
    },
    [Item.chest]: {
        item: Item.chest,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}chest_1.png`,
        armourRating: 2,
    },
    [Item.clothGloves]: {
        item: Item.clothGloves,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}cloth_gloves.png`,
    },
    [Item.cowl]: {
        item: Item.cowl,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}cowl.png`,
        armourRating: 20,
    },
    [Item.druidChest]: {
        item: Item.druidHands,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}druid-chest.png`,
    },
    [Item.druidFeet]: {
        item: Item.druidFeet,
        equipmentType: ApparelType.feet,
        itemType,
        iconImg: `${basePath}druid-feet.png`,
    },
    [Item.druidHands]: {
        item: Item.druidHands,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}druid-hands.png`,
    },
    [Item.druidHead]: {
        item: Item.druidHead,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}druid-head.png`,
    },
    [Item.druidLegs]: {
        item: Item.druidLegs,
        equipmentType: ApparelType.legs,
        itemType,
        iconImg: `${basePath}druid-legs.png`,
    },
    [Item.fedora]: {
        item: Item.fedora,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}fedora.png`,
    },
    [Item.greaves1]: {
        item: Item.greaves1,
        equipmentType: ApparelType.feet,
        itemType,
        iconImg: `${basePath}greaves_1.png`,
        armourRating: 10,
    },
    [Item.greaves2]: {
        item: Item.greaves2,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}greaves_2.png`,
    },
    [Item.hornedHelmet]: {
        item: Item.hornedHelmet,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}horned_helmet.png`,
    },
    [Item.leatherGloves]: {
        item: Item.leatherGloves,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}leather_gloves.png`,
    },
    [Item.nomadHelmet]: {
        item: Item.nomadHelmet,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}nomad_helmet.png`,
    },
    [Item.pants1]: {
        item: Item.pants1,
        equipmentType: ApparelType.legs,
        itemType,
        iconImg: `${basePath}pants_1.png`,
        armourRating: 10,
    },
    [Item.pants2]: {
        item: Item.pants2,
        equipmentType: ApparelType.legs,
        itemType,
        iconImg: `${basePath}pants_2.png`,
    },
    [Item.plateChest1]: {
        item: Item.plateChest1,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_1.png`,
    },
    [Item.plateChest2]: {
        item: Item.plateChest2,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_2.png`,
    },
    [Item.plateChest3]: {
        item: Item.plateChest3,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_3.png`,
    },
    [Item.plateChest4]: {
        item: Item.plateChest4,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}plate_chest_4.png`,
    },
    [Item.plateGloves1]: {
        item: Item.plateGloves1,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_1.png`,
    },
    [Item.plateGloves2]: {
        item: Item.plateGloves2,
        equipmentType: ApparelType.hands,
        itemType,
        iconImg: `${basePath}plate_gloves_2.png`,
    },
    [Item.plateHelmet]: {
        item: Item.plateHelmet,
        equipmentType: ApparelType.head,
        itemType,
        iconImg: `${basePath}plate_helmet_1.png`,
    },
    [Item.platePants]: {
        item: Item.platePants,
        equipmentType: ApparelType.legs,
        itemType,
        iconImg: `${basePath}plate_pants1.png`,
    },
    [Item.plateShoulders1]: {
        item: Item.plateShoulders1,
        equipmentType: ApparelType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_1.png`,
    },
    [Item.plateShoulders2]: {
        item: Item.plateShoulders2,
        equipmentType: ApparelType.shoulders,
        itemType,
        iconImg: `${basePath}plate_shoulders_2.png`,
    },
    [Item.robe]: {
        item: Item.robe,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}robe_1.png`,
    },
    [Item.shoulders1]: {
        item: Item.shoulders1,
        equipmentType: ApparelType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_1.png`,
    },
    [Item.shoulders2]: {
        item: Item.shoulders2,
        equipmentType: ApparelType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_2.png`,
    },
    [Item.shoulders3]: {
        item: Item.shoulders3,
        equipmentType: ApparelType.shoulders,
        itemType,
        iconImg: `${basePath}shoulders_3.png`,
    },
    [Item.vest]: {
        item: Item.vest,
        equipmentType: ApparelType.chest,
        itemType,
        iconImg: `${basePath}vest_1.png`,
    },
};

export default all;

export function getDefinition<T extends ApparelDefinition>(apparel: string): T {
    return all[apparel] as T;
}
