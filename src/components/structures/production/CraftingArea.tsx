import { useState } from 'react'
import { IconSize } from 'components/ui/common/Icon'
import ItemIcon from 'components/ui/items/ItemIcon'
import { type Structure } from 'definitions/structures'
import { type ProducableItem, type ProductionStructureStoreState } from 'store/types/structure'
import { useStructureState } from 'hooks/store/structures'
import { TextManager } from 'global/TextManager'
import { CraftingDetails } from './CraftingDetails'

export type Props = {
  structure: Structure
}

const CraftingArea = (props: Props) => {
  const { structure } = props
  const [selectedItem, setSelectedItem] = useState<ProducableItem>()

  const storeState = useStructureState<ProductionStructureStoreState>(structure)
  const handleSelectCraftingItem = (item: ProducableItem) => {
    setSelectedItem(item)
  }

  return (
    <>
      <div> { TextManager.get('ui-structure-production-craft') }</div>
      <div className="crafting-area">
        <ul className="vertical-tab-bar">
          {storeState.produces.map((type) => (
            <li
              key={`craft${type}`}
              onClick={() => { handleSelectCraftingItem(type) }}
              className={selectedItem === type ? 'selected' : ''}
            >
              <ItemIcon item={{ type }} size={IconSize.smallest} />
              { TextManager.getItemName(type) }
            </li>
          ))}
        </ul>
        { selectedItem !== undefined && <CraftingDetails item={selectedItem} structure={structure} /> }
      </div>
    </>
  )
}

export default CraftingArea
