import { useMemo } from 'react'
import { useAdventurer } from 'hooks/store/adventurers'
import { type AdventurerObject } from 'store/types/scene'
import Attributes from 'components/ui/attributes/AttributeList'
import { xpToLevel } from 'mechanics/adventurers/levels'
import * as TextManager from 'global/TextManager'
import CombatAttributes from './CombatAttributes'
import { calculateEffectiveAttributes, calculateEffectiveAttributesExtended } from 'mechanics/adventurers/attributes'

type Props = {
  actorObject: AdventurerObject
}

const AdventurerContext = (props: Props) => {
  const { actorObject } = props
  const adventurer = useAdventurer(actorObject.adventurerId)
  const attributes = calculateEffectiveAttributes(adventurer)
  const { name, xp } = adventurer
  const level = xpToLevel(xp)
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer])

  return (
    <div>
      <div className="name-and-level">
        <div className="name">
          {name}
        </div>
        <div className="level">
          {TextManager.get('ui-tooltip-actor-level', { level })}
        </div>
      </div>
      <Attributes attributes={extendedAttributes} small />
      <CombatAttributes attributes={attributes} level={level} />
    </div>
  )
}

export default AdventurerContext
