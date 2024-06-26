import * as TextManager from 'global/TextManager'
import { type Apparel, getDefinition as getApparelDefinition } from 'definitions/items/apparel'
import ProduceOrStudy from './common/ProduceOrStudy'
import { type Item } from 'definitions/items/types'
import Effects from './Effects'

type Props = {
  item: Item<Apparel>
}

const ApparelContent = (props: Props) => {
  const { item } = props
  const definition = getApparelDefinition(item.type)

  const { damageReduction } = definition
  const subtext = TextManager.getItemSubtext(item.type)
  const equipmentSlot = TextManager.getEquipmentSlot(definition.equipmentType)
  const { durability = 1 } = item

  return (
    <>
      <div className="subheader">{`${equipmentSlot}`}</div>
      { subtext && (<p className="secondary">{`"${subtext}"`}</p>)}
      <hr />
      { damageReduction && <p> { TextManager.get('ui-tooltip-damage-reduction', { damageReduction }) } </p> }
      { !!(definition.effects?.length) && (
        <Effects effects={definition.effects}/>
      )}
      <dl>
        <dt>{TextManager.get('ui-tooltip-durability')}</dt>
        <dd>{(durability * 100).toFixed(0)}%</dd>
      </dl>
      <ProduceOrStudy item={item.type} />
    </>
  )
}

export default ApparelContent
