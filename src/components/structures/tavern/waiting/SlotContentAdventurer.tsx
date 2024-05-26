import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import Button from 'components/ui/buttons/Button'
import { IconSize } from 'components/ui/common/Icon'
import { useAdventurer } from 'hooks/store/adventurers'
import { useStructureState } from 'hooks/store/structures'
import { xpToLevel } from 'mechanics/adventurers/levels'
import { getFreeRoom } from 'store/helpers/storeHelpers'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type TavernStructureState } from 'store/types/structure'
import * as TextManager from 'global/TextManager'
import GoldAmount from 'components/ui/gold'
import { LODGE_COST } from 'mechanics/tavern'

type Props = {
  adventurerId: string
  onLodge: (adventurer: AdventurerStoreState) => void
  onDismiss: (adventurer: AdventurerStoreState) => void
}

const SlotContentAdventurer = (props: Props) => {
  const { adventurerId, onLodge, onDismiss } = props
  const adventurer = useAdventurer(adventurerId)
  const tavern = useStructureState<TavernStructureState>('tavern')
  const canLodge = getFreeRoom(tavern) !== -1

  return (
    <div className="slot-content with-adventurer">
      <div className="advenventurer">
        <AdventurerAvatar
          adventurer={adventurer}
          size={IconSize.big}
        />
        <div className="name">
          {adventurer.name}
        </div>
        <div className="level">
          {TextManager.get('ui-adventurer-info-level', { level: xpToLevel(adventurer.xp) })}
        </div>
      </div>
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
      <Button
        className="button-dismiss"
        size="medium"
        color="empty"
        onClick={() => { onDismiss(adventurer) }}
      >
        {TextManager.get('ui-structure-tavern-dismiss')}
      </Button>
    </div>
  )
}

export default SlotContentAdventurer
