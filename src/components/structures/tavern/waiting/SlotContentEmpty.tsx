import { type TavernStructureState } from 'store/types/structure'
import * as TextManager from 'global/TextManager'
import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import { Direction } from 'components/ui/common/progress/PlainProgressbar'
import { TickingProgressbar } from 'components/ui/common/progress'
import { ADVENTURER_ARRIVAL_INTERVAL } from 'mechanics/gameTick/tavern'
import { formatDuration } from 'utils/format/time'

const SlotContentEmpty = () => {
  const { nextAdventurersArrive } = useSelector<StoreState, TavernStructureState>(store => store.structures.tavern)

  const delta = (nextAdventurersArrive - Date.now())

  return (
    <div className="slot-content empty">
        <TickingProgressbar
          direction={Direction.decreasing}
          label={`${TextManager.get('ui-structure-tavern-next-adventurer', {
            time: formatDuration(delta)
          })}`}
          progress={delta / ADVENTURER_ARRIVAL_INTERVAL}
        />
    </div>
  )
}

export default SlotContentEmpty
