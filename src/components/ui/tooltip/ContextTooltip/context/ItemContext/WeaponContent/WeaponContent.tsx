import { getDefinition as getWeaponDefinition, type Weapon } from 'definitions/items/weapons'
import * as TextManager from 'global/TextManager'
import ProduceOrStudy from '../common/ProduceOrStudy'
import { type Item } from 'definitions/items/types'
import DamageList from './DamageList'
import Effects from '../Effects'
import { getDefinition as getWeaponTypeDefinition } from 'definitions/weaponTypes'
import { WeaponType } from 'definitions/weaponTypes/types'
import AbilitiesList from './AbilitiesList'
import './styles/weaponContent.scss'

type Props = {
  item: Item<Weapon>
}

const WeaponContent = (props: Props) => {
  const { item } = props
  const definition = getWeaponDefinition(item.type)

  const subtext = TextManager.getItemSubtext(item.type)
  const weaponType = TextManager.getWeaponType(definition.weaponType)
  const { classification } = getWeaponTypeDefinition(definition.weaponType)
  const classificationText = TextManager.getWeaponClassification(classification)

  return (
    <div className="weapon-content">
      <div className="subheader">{weaponType}
        {definition.weaponType !== WeaponType.shield && (` (${classificationText})`)}
      </div>
      <hr />
      { (definition.damage != null) && <DamageList damage={definition.damage} /> }
      { !!(definition.effects?.length) && (
        <Effects effects={definition.effects}/>
      )}
      <hr />
      <AbilitiesList weaponType={definition.weaponType} />
      <hr />
      <ProduceOrStudy item={item.type} />
      { subtext != null && (
        <>
          <hr />
          <p className="secondary">{`"${subtext}"`}</p>
        </>
      )}
    </div>
  )
}

export default WeaponContent
