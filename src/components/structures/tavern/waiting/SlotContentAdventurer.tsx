import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import Button from 'components/ui/buttons/Button'
import { IconSize } from 'components/ui/common/Icon'
import { useAdventurer } from 'hooks/store/adventurers'
import { xpToLevel } from 'mechanics/adventurers/levels'
import { type AdventurerStoreState } from 'store/types/adventurer'
import * as TextManager from 'global/TextManager'
import LodgeButton from './LodgeButton'

type Props = {
  adventurerId: string
  onLodge: (adventurer: AdventurerStoreState) => void
  onDismiss: (adventurer: AdventurerStoreState) => void
}

const SlotContentAdventurer = (props: Props) => {
  const { adventurerId, onLodge, onDismiss } = props
  const adventurer = useAdventurer(adventurerId)

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
      <LodgeButton
        onLodge={onLodge}
        adventurer={adventurer}
      />
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
