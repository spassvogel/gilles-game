import { getProductionStructureForItem } from 'definitions/production'
import { type ProducableItem } from 'store/types/structure'
import { getDefinition as getItemDefinition } from 'definitions/items'
import ProducedAtStructure from './ProducedAtStructure'
import * as TextManager from 'global/TextManager'

type Props = {
  item: ProducableItem
}

const ProduceOrStudy = (props: Props) => {
  const structure = getProductionStructureForItem(props.item)
  const itemDefinition = getItemDefinition(props.item)
  if (itemDefinition.unique ?? false) {
    return (
      <p>{TextManager.get('ui-tooltip-unique-item')}</p>
    )
  }
  if (structure == null) {
    return null
  }
  return (
    <ProducedAtStructure item={props.item} structure={structure} />
  )
}

export default ProduceOrStudy
