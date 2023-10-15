import Tab from 'components/ui/tabs/Tab'
import Tabstrip from 'components/ui/tabs/Tabstrip'
import { ItemCategory } from 'definitions/items/types'
import { TextManager } from 'global/TextManager'
import { useState } from 'react'
import { listEnum } from 'utils/typescript'
import ammunition from 'definitions/items/ammunition'
import apparel from 'definitions/items/apparel'
import deeds from 'definitions/items/deeds'
import herbs from 'definitions/items/herbs'
import materials from 'definitions/items/materials'
import minerals from 'definitions/items/minerals'
import consumables from 'definitions/items/consumables'
import questItems from 'definitions/items/questItems'
import trinkets from 'definitions/items/trinkets'
import weapons from 'definitions/items/weapons'
import DebugItemsList from './DebugItemsList'

const DebugItems = () => {
  const [selected, setSelected] = useState<string>(`${listEnum(ItemCategory)[0]}`)

  return (
    <div className="debug-items content">
      <Tabstrip className="tabs auto-collapse" onTabSelected={setSelected} activeTab={selected}>
        {listEnum(ItemCategory).map((itemCategory) => {
          return (
          <Tab id={`${itemCategory}`} key={itemCategory}>
            {TextManager.getItemCategory(itemCategory)}
          </Tab>)
        })}
      </Tabstrip>
      <div className="items">
        {selected === `${ItemCategory.ammunition}` && <DebugItemsList items={ammunition} />}
        {selected === `${ItemCategory.apparel}` && <DebugItemsList items={apparel} />}
        {selected === `${ItemCategory.deed}` && <DebugItemsList items={deeds} />}
        {selected === `${ItemCategory.herb}` && <DebugItemsList items={herbs} />}
        {selected === `${ItemCategory.material}` && <DebugItemsList items={materials} />}
        {selected === `${ItemCategory.mineral}` && <DebugItemsList items={minerals} />}
        {selected === `${ItemCategory.consumable}` && <DebugItemsList items={consumables} />}
        {selected === `${ItemCategory.questItem}` && <DebugItemsList items={questItems} />}
        {selected === `${ItemCategory.trinket}` && <DebugItemsList items={trinkets} />}
        {selected === `${ItemCategory.weapon}` && <DebugItemsList items={weapons} />}
      </div>
    </div>
  )
}

export default DebugItems
