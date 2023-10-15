import { IconSize } from 'components/ui/common/Icon'
import ItemIcon from 'components/ui/items/ItemIcon'
import { type ApparelDefinition } from 'definitions/items/apparel'
import { type ItemDefinition, type ItemType } from 'definitions/items/types'
import { TextManager } from 'global/TextManager'
import { entries } from 'utils/typescript'
import './styles/debugItemsList.scss'

type Props = {
  items: Record<string, ItemDefinition>
}

const parseRarity = (input: unknown) => {
  const object = input as Pick<ItemDefinition, 'rarity'>
  if (object.rarity !== undefined) {
    return {
      ...object,
      rarity: `Rarity.${TextManager.getRarity(object.rarity)}`
    }
  }
  return object as unknown
}

const parseEquipmentType = (input: unknown) => {
  const object = input as Pick<ApparelDefinition, 'equipmentType'>
  if (object.equipmentType !== undefined) {
    return {
      ...object,
      equipmentType: `EquipmentSlotType.${TextManager.getEquipmentSlot(object.equipmentType)}`
    }
  }
  return object as unknown
}

const parsers = [
  parseRarity,
  parseEquipmentType
]

const prepareText = (definition: ItemDefinition) => {
  const text = parsers.reduce<unknown>((acc, value) => {
    return value(acc)
  }, definition)

  const asString = JSON.stringify(text, undefined, 2)
    .replace(/\n /g, '\n')
    .replace(/ "/g, '"')
    .replace(/\n {3}\{/g, '{')
    .replace(/\n {4}/g, '\n  ')
    .replace(/\n \}/g, '\n}')
    .replace(/\n {3}\},/g, '\n}, ')
    .replace(/\n {3}\}\n ]/g, '\n}]')

  return asString.substring(2, asString.length - 2)
}

const DebugItemsList = (props: Props) => {
  const { items } = props
  return (
    <div className="debug-items-list">
      {entries(items).map(([key, value]) => {
        return (
          <div className="item" key={key}>
            <ItemIcon item={{ type: key as ItemType }} size={IconSize.big} />
            <div className="info">
              <h4>{TextManager.getItemName(key as ItemType)}</h4>
              <pre>
                {prepareText(value)}
              </pre>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DebugItemsList
