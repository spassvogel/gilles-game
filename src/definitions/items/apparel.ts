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
    cultistBoots: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}cultist_boots.png`,
        damageReduction: 2,
    },
    crimsonRogueBoots: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}crimson_rogue_boots.png`,
        damageReduction: 2,
    },
    crimsonRogueBritches: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}crimson_rogue_britches.png`,
        damageReduction: 2,
    },
    crimsonRogueCoif: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}crimson_rogue_coif.png`,
        damageReduction: 2,
    },
    crimsonRogueGrips: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}crimson_rogue_grips.png`,
        damageReduction: 2,
    },
    crimsonRogueSpaulders: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}crimson_rogue_spaulders.png`,
        damageReduction: 2,
    },
    crimsonRogueTunic: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}crimson_rogue_tunic.png`,
        damageReduction: 2,
    },
    cultistGloves: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}cultist_gloves.png`,
        damageReduction: 2,
    },
    cultistPants: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}cultist_pants.png`,
        damageReduction: 2,
    },
    cultistRobe: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}cultist_robe.png`,
        damageReduction: 2,
    },
    cultistShoulderwraps: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}cultist_shoulderwraps.png`,
        damageReduction: 2,
    },
    darkPrinceBracers: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}dark_prince_bracers.png`,
        damageReduction: 2,
    },
    darkPrinceCape: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}dark_prince_cape.png`,
        damageReduction: 2,
    },
    darkPrinceCuirass: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}dark_prince_cuirass.png`,
        damageReduction: 2,
    },
    darkPrinceHood: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}dark_prince_hood.png`,
        damageReduction: 2,
    },
    darkPrinceSarong: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}dark_prince_sarong.png`,
        damageReduction: 2,
    },
    darkPrinceSlippers: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}dark_prince_slippers.png`,
        damageReduction: 2,
    },
    dreadnoughtBoots: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}dreadnought_boots.png`,
        damageReduction: 8,
    },
    dreadnoughtChest: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}dreadnought_chest.png`,
        damageReduction: 8,
    },
    dreadnoughtGauntlets: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}dreadnought_gauntlets.png`,
        damageReduction: 8,
    },
    dreadnoughtHelm: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}dreadnought_helm.png`,
        damageReduction: 8,
    },
    dreadnoughtLegplates: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}dreadnought_legplates.png`,
        damageReduction: 8,
    },
    dreadnoughtPauldrons: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}dreadnought_pauldrons.png`,
        damageReduction: 8,
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
    footmanBoots: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}footman_boots.png`,
    },
    footmanBreastplate: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}footman_breastplate.png`,
    },
    footmanFaceguard: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}footman_faceguard.png`,
    },
    footmanFists: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}footman_fists.png`,
    },
    footmanLegplates: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}footman_legplates.png`,
    },
    footmanPauldrons: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}footman_pauldrons.png`,
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
    naturalistsCape: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}naturalists_cape.png`,
    },
    naturalistsCowl: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}naturalists_cowl.png`,
    },
    naturalistsFootwraps: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}naturalists_footwraps.png`,
    },
    naturalistsVambraces: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}naturalists_vambraces.png`,
    },
    naturalistsVest: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}naturalists_vest.png`,
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
    studdedLeatherShoulderguards: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}studded_leather_shoulderguards.png`,
    },
    sunchaserBritches: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}sunchaser_britches.png`,
    },
    sunchaserGloves: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}sunchaser_gloves.png`,
    },
    sunchaserHelm: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}sunchaser_helm.png`,
    },
    sunchaserMantle: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}sunchaser_mantle.png`,
    },
    sunchaserMoccasins: {
        equipmentType: EquipmentSlotType.feet,
        itemType,
        iconImg: `${basePath}sunchaser_moccasins.png`,
    },
    sunchaserTunic: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}sunchaser_tunic.png`,
    },
    templeGuardChestplate: {
        equipmentType: EquipmentSlotType.chest,
        itemType,
        iconImg: `${basePath}temple_guard_chestplate.png`,
    },
    templeGuardGloves: {
        equipmentType: EquipmentSlotType.hands,
        itemType,
        iconImg: `${basePath}temple_guard_gloves.png`,
    },
    templeGuardGreaves: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}temple_guard_greaves.png`,
    },
    templeGuardHelm: {
        equipmentType: EquipmentSlotType.head,
        itemType,
        iconImg: `${basePath}temple_guard_helm.png`,
    },
    templeGuardLegplates: {
        equipmentType: EquipmentSlotType.legs,
        itemType,
        iconImg: `${basePath}temple_guard_legplates.png`,
    },
    templeGuardPauldrons: {
        equipmentType: EquipmentSlotType.shoulders,
        itemType,
        iconImg: `${basePath}temple_guard_pauldrons.png`,
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