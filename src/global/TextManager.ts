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
import { type Attribute } from 'store/types/adventurer'
import { checkIfEnemy, type EnemyType } from 'definitions/enemies/types'
import { type QuestStoreState } from 'store/types/quest'
import { type Effect, EffectType } from 'definitions/effects/types'
import { type TempEffect, TempEffectType } from 'definitions/tempEffects/types'
import { Rarity } from 'constants/items'
import { WeaponClassification, WeaponType } from 'definitions/weaponTypes/types'
import { WeaponAbility } from 'definitions/abilities/types'

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

export const getAdventurerName = (adventurerId: string) => {
  return get(`adventurer-${adventurerId}-name`)
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

const itemArticleUndefined = (item: ItemType) => {
  const name = getItemName(item)
  const articleTemplate = getTemplate('common-article-undefined')
  return new Handlebars.SafeString(`${articleTemplate({ noun: name })}`)
}

const itemArticleDefined = (item: ItemType) => {
  const name = getItemName(item)
  const articleTemplate = getTemplate('common-article-defined')
  return new Handlebars.SafeString(`${articleTemplate({ noun: name })}`)
}

const itemArticleAuto = (item: ItemType) => {
  return itemArticleUndefined(item)
}

Handlebars.registerHelper('template', (template: string, context?: unknown) => {
  const text = get(template, context)
  return new Handlebars.SafeString(text)
})

Handlebars.registerHelper('item:name', (itemOrItemType: Item | ItemType, article?: string) => {
  let itemType: ItemType
  if (isItemType(itemOrItemType)) {
    itemType = itemOrItemType
  } else {
    itemType = itemOrItemType.type
  }
  if (getDefinition(itemType) === undefined) {
    return new Handlebars.SafeString(`<<ITEM DEFINITION NOT FOUND: ${itemType}>>`)
  }
  switch (article) {
    case 'aA': // article Auto
      return itemArticleAuto(itemType)
    case 'aD': // article Defined "a sword"
      return itemArticleDefined(itemType)
    case 'aU': // article Defined "the sword"
      return itemArticleDefined(itemType)
    default:
      // No article
      return new Handlebars.SafeString(itemType)
  }
})

Handlebars.registerHelper('item:trigger', (item: Item) => {
  return new Handlebars.SafeString(`:item[${JSON.stringify(item)}]`)
})

Handlebars.registerHelper('structure:name', (structure: Structure) => {
  const name = get(`structure-${toKebab(structure)}-name`)
  return new Handlebars.SafeString(name)
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

Handlebars.registerHelper('adventurer:name', (adventurerId: string) => {
  const name = getAdventurerName(adventurerId)
  return new Handlebars.SafeString(name)
})

Handlebars.registerHelper('actor:name', (actor: string) => {
  if (checkIfEnemy(actor)) {
    const name = getEnemyName(actor?.substring(0, actor.indexOf('_')))
    return new Handlebars.SafeString(name)
  }
  const name = getAdventurerName(actor)
  return new Handlebars.SafeString(name)
})
