import * as TextManager from 'global/TextManager'
import { type Consumable } from 'definitions/items/consumables'
import { type ItemSource } from 'constants/items'
import { type Item } from 'definitions/items/types'

type Props = {
  item: Item<Consumable>
  source?: ItemSource
}

const ConsumableContent = (props: Props) => {
  const { item } = props
  const subtext = TextManager.getItemSubtext(item.type)

  return (
    <div>
      { subtext && (<p className="subtext">{`"${subtext}"`}</p>)}
    </div>
  )
}

export default ConsumableContent
