import { type ItemType, type ItemDefinition, ItemCategory } from './types'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Effect, type EffectAttibuteIncrease, EffectType } from 'definitions/effects/types'
import { Rarity } from 'constants/items'

type Prefix = 'apparel/'
const PREFIX = 'apparel/'
const itemCategory = ItemCategory.apparel
const basePath = 'img/items/apparel/'

const crimsonRogueEffect: EffectAttibuteIncrease = {
  type: EffectType.attributeIncrease,
  attribute: 'agi',
  factor: 1.05
}

export type ApparelDefinition = {
  equipmentType: EquipmentSlotType
  damageReduction?: number
  effects?: Effect[]
} & ItemDefinition

const definitions = {
  boots1: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}boots_1.png`
  },
  boots2: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    damageReduction: 1,
    iconImg: `${basePath}boots_2.png`
  },
  boots3: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    damageReduction: 2,
    iconImg: `${basePath}boots_3.png`
  },
  chainmailHood: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}chainmail_hood.png`,
    damageReduction: 3
  },
  chest: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}chest_1.png`,
    damageReduction: 2
  },
  clothGloves: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}cloth_gloves.png`,
    damageReduction: 1
  },
  cowl: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}cowl.png`,
    damageReduction: 2
  },
  cultistBoots: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}cultist_boots.png`,
    damageReduction: 2
  },
  crimsonRogueBoots: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_boots.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  crimsonRogueBritches: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_britches.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  crimsonRogueCoif: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_coif.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  crimsonRogueGrips: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_grips.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  crimsonRogueSpaulders: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_spaulders.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  crimsonRogueTunic: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}crimson_rogue_tunic.png`,
    damageReduction: 2,
    effects: [crimsonRogueEffect]
  },
  cultistGloves: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}cultist_gloves.png`,
    damageReduction: 2
  },
  cultistPants: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}cultist_pants.png`,
    damageReduction: 2
  },
  cultistRobe: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}cultist_robe.png`,
    damageReduction: 2
  },
  cultistShoulderwraps: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}cultist_shoulderwraps.png`,
    damageReduction: 2
  },
  darkPrinceBracers: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}dark_prince_bracers.png`,
    damageReduction: 2
  },
  darkPrinceCape: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}dark_prince_cape.png`,
    damageReduction: 2
  },
  darkPrinceCuirass: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}dark_prince_cuirass.png`,
    damageReduction: 2
  },
  darkPrinceHood: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}dark_prince_hood.png`,
    damageReduction: 2
  },
  darkPrinceSarong: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}dark_prince_sarong.png`,
    damageReduction: 2
  },
  darkPrinceSlippers: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}dark_prince_slippers.png`,
    damageReduction: 2
  },
  dreadnoughtBoots: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}dreadnought_boots.png`,
    damageReduction: 8
  },
  dreadnoughtChest: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}dreadnought_chest.png`,
    damageReduction: 8
  },
  dreadnoughtGauntlets: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}dreadnought_gauntlets.png`,
    damageReduction: 8
  },
  dreadnoughtHelm: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}dreadnought_helm.png`,
    damageReduction: 8
  },
  dreadnoughtLegplates: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}dreadnought_legplates.png`,
    damageReduction: 8
  },
  dreadnoughtPauldrons: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}dreadnought_pauldrons.png`,
    damageReduction: 8
  },
  druidChest: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}druid-chest.png`
  },
  druidFeet: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}druid-feet.png`
  },
  druidHands: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}druid-hands.png`
  },
  druidHead: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}druid-head.png`
  },
  druidLegs: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}druid-legs.png`
  },
  fedora: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}fedora.png`
  },
  footmanBoots: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}footman_boots.png`
  },
  footmanBreastplate: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}footman_breastplate.png`
  },
  footmanFaceguard: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}footman_faceguard.png`
  },
  footmanFists: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}footman_fists.png`
  },
  footmanLegplates: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}footman_legplates.png`
  },
  footmanPauldrons: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}footman_pauldrons.png`
  },
  greaves1: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}greaves_1.png`,
    damageReduction: 2
  },
  greaves2: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}greaves_2.png`
  },
  hornedHelmet: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}horned_helmet.png`
  },
  leatherGloves: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}leather_gloves.png`
  },
  naturalistsCape: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}naturalists_cape.png`
  },
  naturalistsCowl: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}naturalists_cowl.png`
  },
  naturalistsFootwraps: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}naturalists_footwraps.png`
  },
  naturalistsVambraces: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}naturalists_vambraces.png`
  },
  naturalistsVest: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}naturalists_vest.png`
  },
  nomadHelmet: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}nomad_helmet.png`
  },
  pants1: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}pants_1.png`,
    damageReduction: 3
  },
  pants2: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}pants_2.png`,
    damageReduction: 3
  },
  plateChest1: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}plate_chest_1.png`
  },
  plateChest2: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}plate_chest_2.png`
  },
  plateChest3: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}plate_chest_3.png`
  },
  plateChest4: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}plate_chest_4.png`
  },
  plateGloves1: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}plate_gloves_1.png`
  },
  plateGloves2: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}plate_gloves_2.png`
  },
  plateHelmet: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}plate_helmet_1.png`
  },
  platePants: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}plate_pants1.png`
  },
  plateShoulders1: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}plate_shoulders_1.png`
  },
  plateShoulders2: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}plate_shoulders_2.png`
  },
  robe: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}robe_1.png`
  },
  shoulders1: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}shoulders_1.png`
  },
  shoulders2: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}shoulders_2.png`,
    damageReduction: 2
  },
  shoulders3: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}shoulders_3.png`
  },
  studdedLeatherShoulderguards: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}studded_leather_shoulderguards.png`
  },
  sunchaserBritches: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}sunchaser_britches.png`
  },
  sunchaserGloves: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}sunchaser_gloves.png`
  },
  sunchaserHelm: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}sunchaser_helm.png`
  },
  sunchaserMantle: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}sunchaser_mantle.png`
  },
  sunchaserMoccasins: {
    equipmentType: EquipmentSlotType.feet,
    itemCategory,
    iconImg: `${basePath}sunchaser_moccasins.png`
  },
  sunchaserTunic: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}sunchaser_tunic.png`
  },
  templeGuardChestplate: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}temple_guard_chestplate.png`
  },
  templeGuardGloves: {
    equipmentType: EquipmentSlotType.hands,
    itemCategory,
    iconImg: `${basePath}temple_guard_gloves.png`
  },
  templeGuardGreaves: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}temple_guard_greaves.png`
  },
  templeGuardHelm: {
    equipmentType: EquipmentSlotType.head,
    itemCategory,
    iconImg: `${basePath}temple_guard_helm.png`
  },
  templeGuardLegplates: {
    equipmentType: EquipmentSlotType.legs,
    itemCategory,
    iconImg: `${basePath}temple_guard_legplates.png`
  },
  templeGuardPauldrons: {
    equipmentType: EquipmentSlotType.shoulders,
    itemCategory,
    iconImg: `${basePath}temple_guard_pauldrons.png`
  },
  vest: {
    equipmentType: EquipmentSlotType.chest,
    itemCategory,
    iconImg: `${basePath}vest_1.png`
  },
  witchhunterBoots: {
    equipmentType: EquipmentSlotType.feet,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_boots.png`
  },
  witchhunterBritches: {
    equipmentType: EquipmentSlotType.legs,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_britches.png`
  },
  witchhunterCape: {
    equipmentType: EquipmentSlotType.shoulders,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_cape.png`
  },
  witchhunterGambeson: {
    equipmentType: EquipmentSlotType.chest,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_gambeson.png`
  },
  witchhunterGrips: {
    equipmentType: EquipmentSlotType.hands,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_grips.png`
  },
  witchhunterHat: {
    equipmentType: EquipmentSlotType.head,
    rarity: Rarity.epic,
    itemCategory,
    iconImg: `${basePath}witchhunter_hat.png`
  }
}

export type Apparel = `${Prefix}${keyof typeof definitions}`
const all = Object.entries(definitions).reduce<Record<string, ApparelDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Apparel, ApparelDefinition>
export default all

export function getDefinition (apparel: Apparel): ApparelDefinition {
  return all[apparel]
}

export const isApparel = (item: ItemType): item is Apparel => {
  return all[item as Apparel] !== undefined
}
