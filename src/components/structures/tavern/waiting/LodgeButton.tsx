import Button from 'components/ui/buttons/Button'
import GoldAmount from 'components/ui/gold'
import { LODGE_COST } from 'mechanics/tavern'
import { type AdventurerStoreState } from 'store/types/adventurer'
import * as TextManager from 'global/TextManager'
import { getFreeRoom } from 'store/helpers/storeHelpers'
import { useStructureState } from 'hooks/store/structures'
import { type TavernStructureState } from 'store/types/structure'
import useGoldState from 'hooks/store/useGoldState'

type Props = {
  adventurer: AdventurerStoreState
  onLodge: (adventurer: AdventurerStoreState) => void
}

const LodgeButton = (props: Props) => {
  const { adventurer, onLodge } = props
  const tavern = useStructureState<TavernStructureState>('tavern')
  const gold = useGoldState()
  const canLodge = getFreeRoom(tavern) !== -1 && gold >= LODGE_COST

  return (
    <Button
      className="button-accept"
      size="medium"
      color="blue"
      disabled={!canLodge}
      onClick={() => { onLodge(adventurer) }}
    >
      <div className="wrapper">
        <div>
          {TextManager.get('ui-structure-tavern-lodge')}
        </div>
        <GoldAmount amount={LODGE_COST} />
      </div>
    </Button>
  )
}

export default LodgeButton
