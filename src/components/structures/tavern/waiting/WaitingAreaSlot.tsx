import { useDispatch, useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import { type TavernStructureState } from 'store/types/structure'
import SlotContentAdventurer from './SlotContentAdventurer'
import { dismissWaitingAdventurer, lodgeWaitingAdventurer } from 'store/actions/structures'
import { SoundManager } from 'global/SoundManager'
import { type AdventurerStoreState } from 'store/types/adventurer'
import * as TextManager from 'global/TextManager'
import { addLogText } from 'store/actions/log'
import SlotContentEmpty from './SlotContentEmpty'

type Props = {
  slot: number
}

const WaitingAreaSlot = (props: Props) => {
  const { slot } = props
  const { waiting } = useSelector<StoreState, TavernStructureState>(store => store.structures.tavern)
  const dispatch = useDispatch()

  const adventurerId = waiting[slot]

  const handleLodge = (adventurer: AdventurerStoreState) => {
    void SoundManager.playSound('UI_BUTTON_CLICK')

    dispatch(lodgeWaitingAdventurer(slot))
    dispatch(addLogText('ui-structure-tavern-adventurer-lodged', { adventurer }))
  }

  const handleDismiss = (adventurer: AdventurerStoreState) => {
    void SoundManager.playSound('UI_BUTTON_CLICK')
    if (confirm(TextManager.get('ui-structure-tavern-confirm-dismiss-adventurer', { adventurer }))) {
      dispatch(dismissWaitingAdventurer(slot))
    }
  }

  if (adventurerId != null) {
    return (
      <div className="slot">
        <SlotContentAdventurer
          adventurerId={adventurerId}
          onLodge={handleLodge}
          onDismiss={handleDismiss}
        />
      </div>
    )
  }

  return (
    <div className="slot">
      <SlotContentEmpty />
    </div>
  )
}

export default WaitingAreaSlot
