import { calculateDodge, calculateInitialAP } from 'mechanics/combat'
import { type AttributesStoreState } from 'store/types/adventurer'
import { roundIfNeeded } from 'utils/format/number'

type Props = {
  attributes: AttributesStoreState
  level: number
}

const CombatAttributes = (props: Props) => {
  const { attributes, level } = props
  return (
    <>
      <div>
        AP each turn: {calculateInitialAP(attributes, level)}
      </div>
      <div>
        Dodge: {roundIfNeeded(calculateDodge(attributes))}%
      </div>
    </>
  )
}

export default CombatAttributes
