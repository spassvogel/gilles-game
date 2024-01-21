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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class TextManager {
  public static init (texts: Record<string, string>, precompile = true) {
    this.texts = texts
    this.templates = {}
    this.notFound = []

    if (precompile) {
      this.compileAll()
    }
    this.initialized = true
  }

  public static get (key: string, context?: unknown): string {
    const result = this.getDefault(key, context)
    if (result === null) {
      if (process.env.NODE_ENV === 'development') {
        this.notFound.push(key)
      }

      console.error(`Key '${key}' not found in TextManager`)
      return `<<'${key}' missing>>`
    } else {
      return decode(result)
    }
  }

  // Will return `null` when no text found, otherwise will return the text
  public static getDefault (key: string, context?: unknown): string | null {
    if (!this.initialized) {
      throw new Error(`Error ${this} not initialized!`)
    }
    const template = this.getTemplate(key)
    if (template == null) {
      return null
    }
    return template(context)
  }

  public static getTextEntry (textEntry: TextEntry): string {
    return this.get(textEntry.key, textEntry.context)
  }

  public static getTemplate (key: string) {
    let template = this.templates[key]
    if (template == null && this.texts[key] == null) {
      // Template not found but key is defined. Needs to be compiled
      this.compile(key, this.texts[key])
      template = this.templates[key]
    }
    return template
  }

  public static getAbilityName (ability: WeaponAbility) {
    return this.get(`ability-${WeaponAbility[ability]}-name`)
  }

  public static getAdventurerName (adventurerId: string) {
    return this.get(`adventurer-${adventurerId}-name`)
  }

  public static getAdventurerFlavor (adventurerId: string, adventurerName?: string) {
    return this.get(`adventurer-${adventurerId}-flavor`, { name: adventurerName })
  }

  public static getAttributeName (attribute: Attribute): string {
    return this.get(`common-attribute-${attribute}-name`)
  }

  public static getAttributeDescription (attribute: Attribute): string {
    return this.get(`common-attribute-${attribute}-description`)
  }

  public static getAttributeMechanics (attribute: Attribute): string {
    return this.get(`common-attribute-${attribute}-mechanics`)
  }

  public static getEnemyName (enemyType: EnemyType) {
    return this.get(`enemy-${enemyType}-name`)
  }

  public static getEquipmentSlot (slotType: EquipmentSlotType) {
    return this.get(`ui-equipmentslot-${toKebab(EquipmentSlotType[slotType])}`)
  }

  public static getQuestTitle (name: string) {
    return this.get(`quest-${toKebab(name)}-title`)
  }

  public static getQuestDescription (name: string) {
    return this.get(`quest-${toKebab(name)}-description`)
  }

  public static getQuestSceneTitle (quest: QuestStoreState) {
    const sceneName = quest.sceneName ?? ''
    return this.get(`quest-${toKebab(quest.name)}-scene-${toKebab(sceneName)}-title`)
  }

  public static getResourceName (type: Resource) {
    return this.get(`resource-${type}-name`)
  }

  public static getItemName (itemOrItemType: Item | ItemType): string {
    if (isItemType(itemOrItemType)) {
      return this.get(`item-${toKebab(itemOrItemType)}-name`)
    }
    return this.get(`item-${toKebab(itemOrItemType.type)}-name`)
  }

  public static getItemCategory (itemCategory: ItemCategory): string {
    return this.get(`item-category-${toKebab(ItemCategory[itemCategory])}`)
  }

  public static getItemSubtext (item: ItemType): string | null {
    return this.getDefault(`item-${toKebab(item)}-subtext`)
  }

  public static getRarity (rarity: Rarity): string {
    return this.get(`rarity-${Rarity[rarity]}-name`)
  }

  public static getStructureName (structure: Structure): string {
    return this.get(`structure-${toKebab(structure)}-name`)
  }

  public static getTraitName (trait: Trait): string {
    return this.get(`trait-${toKebab(trait)}-name`)
  }

  public static getEffectDescription (effect: Effect, props?: Record<string, string>): string {
    const { type, ...rest } = effect
    return this.get(`effect-${toKebab(EffectType[type])}-description`, { ...rest, ...props })
  }

  public static getEffectFlavor (effect: Effect): string {
    return this.get(`effect-${toKebab(EffectType[effect.type])}-flavor`)
  }

  public static getEffectName (effect: Effect): string {
    return this.get(`effect-${toKebab(EffectType[effect.type])}-name`)
  }

  public static getTempEffectDescription (effect: TempEffect, props?: Record<string, string>): string {
    const { type, ...rest } = effect
    return this.get(`temp-effect-${toKebab(TempEffectType[type])}-description`, { ...rest, ...props })
  }

  public static getTempEffectFlavor (effect: TempEffect): string {
    return this.get(`temp-effect-${toKebab(TempEffectType[effect.type])}-flavor`)
  }

  public static getTempEffectName (effect: TempEffect): string {
    return this.get(`temp-effect-${toKebab(TempEffectType[effect.type])}-name`)
  }

  public static getTraitDescription (trait: Trait): string {
    return this.get(`trait-${toKebab(trait)}-description`)
  }

  public static getTraitEffect (trait: Trait): string {
    return this.get(`trait-${toKebab(trait)}-effect`)
  }

  public static getToastType (type: Type): string {
    return this.get(`ui-toast-type-${toKebab(Type[type])}`)
  }

  public static getWeaponType (type: WeaponType) {
    return this.get(`ui-weapon-type-${toKebab(WeaponType[type])}`)
  }

  public static getSkillName (type: WeaponType) {
    return this.get(`skill-${toKebab(WeaponType[type])}-name`)
  }

  public static getSkillInfo (type: WeaponType) {
    return this.get(`skill-${toKebab(WeaponType[type])}-info`)
  }

  public static getWeaponClassification (weaponClass: WeaponClassification) {
    return this.get(`ui-weapon-class-${toKebab(WeaponClassification[weaponClass])}`)
  }

  // will print all unfound text strings to the console
  public static printNotFounds () {
    if (this.notFound.length > 0) {
      console.log('TextManager strings not found:')
      console.log('"' + this.notFound.join('": "",\n"') + '": ""')
    }
  }

  private static initialized = false

  private static texts: Record<string, string>

  private static templates: Record<string, Handlebars.TemplateDelegate<unknown>>

  private static notFound: string[]

  private static compileAll () {
    Object.keys(this.texts).forEach((key: string) => {
      this.compile(key, this.texts[key])
    })
  }

  private static compile (key: string, value: string) {
    if (value == null) {
      return ''
    }
    const template = Handlebars.compile(value)
    this.templates[key] = template
  }
}

const itemArticleUndefined = (item: ItemType) => {
  const name = TextManager.getItemName(item)
  const articleTemplate = TextManager.getTemplate('common-article-undefined')
  return new Handlebars.SafeString(`${articleTemplate({ noun: name })}`)
}

const itemArticleDefined = (item: ItemType) => {
  const name = TextManager.getItemName(item)
  const articleTemplate = TextManager.getTemplate('common-article-defined')
  return new Handlebars.SafeString(`${articleTemplate({ noun: name })}`)
}

const itemArticleAuto = (item: ItemType) => {
  return itemArticleUndefined(item)
}

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
  const name = TextManager.get(`structure-${toKebab(structure)}-name`)
  return new Handlebars.SafeString(name)
})

Handlebars.registerHelper('structure:link', (structure: Structure) => {
  const name = TextManager.get(`structure-${toKebab(structure)}-name`)
  const link = getStructureLink(structure)
  return new Handlebars.SafeString(`[${name}](#${link})`)
})

Handlebars.registerHelper('resource:name', (resource: string) => {
  const name = TextManager.get(`resource-${resource}-name`)
  return new Handlebars.SafeString(name)
})

Handlebars.registerHelper('adventurer:name', (adventurerId: string) => {
  const name = TextManager.getAdventurerName(adventurerId)
  return new Handlebars.SafeString(name)
})

Handlebars.registerHelper('actor:name', (actor: string) => {
  if (checkIfEnemy(actor)) {
    const name = TextManager.getEnemyName(actor?.substring(0, actor.indexOf('_')))
    return new Handlebars.SafeString(name)
  }
  const name = TextManager.getAdventurerName(actor)
  return new Handlebars.SafeString(name)
})
