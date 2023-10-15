import { TextManager } from 'global/TextManager'
import { type AttributeSource, AttributeSourceType } from 'mechanics/adventurers/attributes'
import { type Attribute } from 'store/types/adventurer'

export const renderOrigin = (origin: AttributeSource, attribute: Attribute) => {
  switch (origin.type) {
    case AttributeSourceType.base:
      return `base ${TextManager.getAttributeName(attribute)}`
    case AttributeSourceType.tempEffect:
      return 'soma' // todo: split out which tempEffect
    case AttributeSourceType.item:
      return TextManager.getItemName(origin.item)
  }
}
