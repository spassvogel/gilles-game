import { Fragment } from 'react'
import { TextManager } from 'global/TextManager'
import { type DamageDefinition } from 'definitions/weaponTypes/types'

type Props = {
  damage: DamageDefinition
}

const DamageList = (props: Props) => {
  const { damage } = props
  return (
    <dl>
      {Object.entries(damage).map(([dmgType, dmg]) => (
        <Fragment key={dmgType}>
          <dd>{TextManager.get(`damage-type-${dmgType}`)}</dd>
          <dt>{dmg}</dt>
        </Fragment>
      ))}
    </dl>
  )
}

export default DamageList
