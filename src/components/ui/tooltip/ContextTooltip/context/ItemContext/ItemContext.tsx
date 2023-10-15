import { type Apparel, isApparel } from 'definitions/items/apparel'
import { type Deed, isDeed } from 'definitions/items/deeds'
import { type Item } from 'definitions/items/types'
import { isWeapon, type Weapon } from 'definitions/items/weapons'
import DeedContent from './DeedContent'
import WeaponContent from './WeaponContent'
import ApparelContent from './ApparelContent'
import { TextManager } from 'global/TextManager'
import { type Consumable, isConsumable } from 'definitions/items/consumables'
import ConsumableContent from './ConsumableContent'
import { type ItemSource } from 'constants/items'

export type Props = {
  item: Item
  source?: ItemSource
}

const ItemContext = (props: Props) => {
  const { item, source } = props

  if (isDeed(item.type)) {
    return <DeedContent item={item as Item<Deed>} />
  }
  if (isWeapon(item.type)) {
    return <WeaponContent item={item as Item<Weapon>} />
  }
  if (isApparel(item.type)) {
    return <ApparelContent item={item as Item<Apparel>} />
  }
  if (isConsumable(item.type)) {
    return <ConsumableContent item={item as Item<Consumable>} source={source} />
  }
  const subtext = TextManager.getItemSubtext(item.type)
  return (subtext !== null && (<p className="subtext">{`"${subtext}"`}</p>)) || null
}
export default ItemContext
