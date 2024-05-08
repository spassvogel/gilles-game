import { paramCase as toKebab } from 'text-param-case'
import { decode } from 'html-entities'
import * as Handlebars from 'handlebars'
import { type TextEntry } from 'constants/text'
import { getDefinition } from 'definitions/items'
import { type ItemType, ItemCategory, isItemType, type Item } from 'definitions/items/types'
import { type Resource } from 'definitions/resources'
import { type Structure } from 'definitions/structures'
import { type Trait } from 'definitions/traits/types'
import { Type } from 'components/ui/toasts/Toast'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { getStructureLink } from 'utils/routing'
import { type AdventurerStoreState, type Attribute } from 'store/types/adventurer'
import { type EnemyType } from 'definitions/enemies/types'
import { type QuestStoreState } from 'store/types/quest'
import { type Effect, EffectType } from 'definitions/effects/types'
import { type TempEffect, TempEffectType } from 'definitions/tempEffects/types'
import { Rarity } from 'constants/items'
import { WeaponClassification, WeaponType } from 'definitions/weaponTypes/types'
import { WeaponAbility } from 'definitions/abilities/types'
import { Gender } from 'constants/gender'
import { Race } from 'constants/race'

let initialized = false
let texts: Record<string, string>
const templates: Record<string, Handlebars.TemplateDelegate<unknown>> = {}
const notFound: string[] = []

export const init = (_texts: Record<string, string>, precompile = true) => {
  texts = _texts

  if (precompile) {
    compileAll()
  }
  initialized = true
}

export const get = (key: string, context?: unknown) => {
  const result = getDefault(key, context)
  if (result === null) {
    if (process.env.NODE_ENV === 'development') {
      notFound.push(key)
    }

    console.error(`Key '${key}' not found in TextManager`)
    return `<<'${key}' missing>>`
  } else {
    return decode(result)
  }
}

// Will return `null` when no text found, otherwise will return the text
export const getDefault = (key: string, context?: unknown) => {
  if (!initialized) {
    throw new Error(`Error ${this} not initialized!`)
  }
  const template = getTemplate(key)
  if (template == null) {
    return null
  }
  return template(context)
}

export const getTextEntry = (textEntry: TextEntry) => {
  return get(textEntry.key, textEntry.context)
}

export const getAbilityName = (ability: WeaponAbility) => {
  return get(`ability-${WeaponAbility[ability]}-name`)
}

export const getAdventurerFlavor = (adventurerId: string, adventurerName?: string) => {
  return get(`adventurer-${adventurerId}-flavor`, { name: adventurerName })
}

export const getAttributeName = (attribute: Attribute) => {
  return get(`common-attribute-${attribute}-name`)
}

export const getAttributeDescription = (attribute: Attribute) => {
  return get(`common-attribute-${attribute}-description`)
}

export const getAttributeMechanics = (attribute: Attribute) => {
  return get(`common-attribute-${attribute}-mechanics`)
}

// todo: unused?
export const getEnemyName = (enemyType: EnemyType) => {
  return get(`enemy-${enemyType}-name`)
}

export const getEquipmentSlot = (slotType: EquipmentSlotType) => {
  return get(`ui-equipmentslot-${toKebab(EquipmentSlotType[slotType])}`)
}

export const getQuestTitle = (name: string) => {
  return get(`quest-${toKebab(name)}-title`)
}

export const getQuestDescription = (name: string) => {
  return get(`quest-${toKebab(name)}-description`)
}

export const getQuestSceneTitle = (quest: QuestStoreState) => {
  const sceneName = quest.sceneName ?? ''
  return get(`quest-${toKebab(quest.name)}-scene-${toKebab(sceneName)}-title`)
}

export const getResourceName = (type: Resource) => {
  return get(`resource-${type}-name`)
}

export const getItemName = (itemOrItemType: Item | ItemType) => {
  if (isItemType(itemOrItemType)) {
    return get(`item-${toKebab(itemOrItemType)}-name`)
  }
  return get(`item-${toKebab(itemOrItemType.type)}-name`)
}

export const getItemCategory = (itemCategory: ItemCategory) => {
  return get(`item-category-${toKebab(ItemCategory[itemCategory])}`)
}

export const getItemSubtext = (item: ItemType) => {
  return getDefault(`item-${toKebab(item)}-subtext`)
}

export const getRarity = (rarity: Rarity) => {
  return get(`rarity-${Rarity[rarity]}-name`)
}

export const getStructureName = (structure: Structure) => {
  return get(`structure-${toKebab(structure)}-name`)
}

export const getTraitName = (trait: Trait) => {
  return get(`trait-${toKebab(trait)}-name`)
}

export const getEffectDescription = (effect: Effect, props?: Record<string, string>) => {
  const { type, ...rest } = effect
  return get(`effect-${toKebab(EffectType[type])}-description`, { ...rest, ...props })
}

export const getEffectFlavor = (effect: Effect) => {
  return get(`effect-${toKebab(EffectType[effect.type])}-flavor`)
}

export const getEffectName = (effect: Effect) => {
  return get(`effect-${toKebab(EffectType[effect.type])}-name`)
}

export const getTempEffectDescription = (effect: TempEffect, props?: Record<string, string>) => {
  const { type, ...rest } = effect
  return get(`temp-effect-${toKebab(TempEffectType[type])}-description`, { ...rest, ...props })
}

export const getTempEffectFlavor = (effect: TempEffect) => {
  return get(`temp-effect-${toKebab(TempEffectType[effect.type])}-flavor`)
}

export const getTempEffectName = (effect: TempEffect) => {
  return get(`temp-effect-${toKebab(TempEffectType[effect.type])}-name`)
}

export const getTraitDescription = (trait: Trait) => {
  return get(`trait-${toKebab(trait)}-description`)
}

export const getTraitEffect = (trait: Trait) => {
  return get(`trait-${toKebab(trait)}-effect`)
}

export const getToastType = (type: Type) => {
  return get(`ui-toast-type-${toKebab(Type[type])}`)
}

export const getRace = (race: Race) => {
  return get(`common-race-${Race[race]}`)
}

export const getWeaponType = (type: WeaponType) => {
  return get(`weapon-type-${toKebab(WeaponType[type])}`)
}

export const getSkillName = (type: WeaponType) => {
  return get(`skill-${toKebab(WeaponType[type])}-name`)
}

export const getSkillInfo = (type: WeaponType) => {
  return get(`skill-${toKebab(WeaponType[type])}-info`)
}

export const getWeaponClassification = (weaponClass: WeaponClassification) => {
  return get(`weapon-class-${toKebab(WeaponClassification[weaponClass])}`)
}

// will print all unfound text strings to the console
export const printNotFounds = () => {
  if (notFound.length > 0) {
    console.log('TextManager strings not found:')
    console.log('"' + notFound.join('": "",\n"') + '": ""')
  }
}

const compileAll = () => {
  Object.keys(texts).forEach((key: string) => {
    compile(key, texts[key])
  })
}

const compile = (key: string, value: string) => {
  if (value == null) {
    return ''
  }
  const template = Handlebars.compile(value)
  templates[key] = template
}

const getTemplate = (key: string) => {
  let template = templates[key]
  if (template == null && texts[key] == null) {
    // Template not found but key is defined. Needs to be compiled
    compile(key, texts[key])
    template = templates[key]
  }
  return template
}

const articleUndefined = (noun: string) => {
  const articleTemplate = getTemplate('common-article-undefined')
  return new Handlebars.SafeString(`${articleTemplate({ noun })}`)
}

const articleDefined = (noun: string) => {
  const articleTemplate = getTemplate('common-article-defined')
  return new Handlebars.SafeString(`${articleTemplate({ noun })}`)
}

const articleAuto = (noun: string) => {
  return articleUndefined(noun)
}

type ArticleType = 'aA' | 'aD' | 'aU'

const articalize = (input: string, article?: ArticleType) => {
  switch (article) {
    case 'aA': // article Auto
      return articleAuto(input)
    case 'aD': // article undefined "a sword"
      return articleDefined(input)
    case 'aU': // article Defined "the sword"
      return articleUndefined(input)
    default:
      // No article
      return new Handlebars.SafeString(input)
  }
}

Handlebars.registerHelper('template', (template: string, context?: unknown) => {
  const text = get(template, context)
  return new Handlebars.SafeString(text)
})

Handlebars.registerHelper('item:name', (itemOrItemType: Item | ItemType, article?: ArticleType) => {
  let itemType: ItemType
  if (isItemType(itemOrItemType)) {
    itemType = itemOrItemType
  } else {
    itemType = itemOrItemType.type
  }
  if (getDefinition(itemType) === undefined) {
    return new Handlebars.SafeString(`<<ITEM DEFINITION NOT FOUND: ${itemType}>>`)
  }

  const name = getItemName(itemType)

  return articalize(name, article)
})

Handlebars.registerHelper('item:trigger', (item: Item) => {
  return new Handlebars.SafeString(`:item[${JSON.stringify(item)}]`)
})

Handlebars.registerHelper('structure:name', (structure: Structure, article?: ArticleType) => {
  const name = get(`structure-${toKebab(structure)}-name`)

  return articalize(name, article)
})

Handlebars.registerHelper('structure:link', (structure: Structure) => {
  const name = get(`structure-${toKebab(structure)}-name`)
  const link = getStructureLink(structure)
  return new Handlebars.SafeString(`[${name}](#${link})`)
})

Handlebars.registerHelper('resource:name', (resource: string) => {
  const name = get(`resource-${resource}-name`)
  return new Handlebars.SafeString(name)
})

Handlebars.registerHelper('adventurer:name', (adventurer: AdventurerStoreState) => {
  return new Handlebars.SafeString(adventurer.name ?? '')
})

Handlebars.registerHelper('adventurer:pronoun-reflexive', (adventurer: AdventurerStoreState) => {
  // himself / herself
  const pronoun = get(`common-pronoun-reflexive-${Gender[adventurer.gender]}`)
  return new Handlebars.SafeString(pronoun)
})

Handlebars.registerHelper('adventurer:pronoun-personal', (adventurer: AdventurerStoreState) => {
  // he / she
  const pronoun = get(`common-pronoun-personal-${Gender[adventurer.gender]}`)
  return new Handlebars.SafeString(pronoun)
})

Handlebars.registerHelper('adventurer:pronoun-possesive', (adventurer: AdventurerStoreState) => {
  // his / her
  const pronoun = get(`common-pronoun-possesive-${Gender[adventurer.gender]}`)
  return new Handlebars.SafeString(pronoun)
})

Handlebars.registerHelper('actor:name', (actor: string) => {
  return new Handlebars.SafeString(actor)
})
