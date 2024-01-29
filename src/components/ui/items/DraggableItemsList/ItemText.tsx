import { type Item } from 'definitions/items/types'
import * as TextManager from 'global/TextManager'

type Props = {
  item: Item
}

const ItemText = (props: Props) => {
  const { item } = props
  if (item == null) {
    throw new Error('empty item.. wtf')
  }

  return (
    <div className="text">
      <p className="name">{TextManager.getItemName(item.type)}</p>
      <p className="subtext">{TextManager.getItemSubtext(item.type)}</p>
    </div>
  )
}

export default ItemText
