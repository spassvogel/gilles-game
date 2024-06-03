import Button from 'components/ui/buttons/Button'
import NumberDial from 'components/ui/common/NumberDial'
import GoldAmount from 'components/ui/gold'
import { useAdventurer } from 'hooks/store/adventurers'
import useGoldState from 'hooks/store/useGoldState'
import { LODGE_COST } from 'mechanics/tavern'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { extendAdventurerLodging } from 'store/actions/structures'
import { type TavernRoomLodging } from 'store/types/structure'
import { formatDays } from 'utils/format/time'

import './styles/extendLodgingModal.scss'
import { TooltipEmitter } from 'emitters/TooltipEmitter'

export type Props = {
  roomLodging: TavernRoomLodging
}

const ExtendLodgingHelpModal = ({ roomLodging }: Props) => {
  const ms = Date.now() - roomLodging.paidUntil
  const adventurer = useAdventurer(roomLodging.adventurer)

  const [days, setDays] = useState(1)
  const dispatch = useDispatch()
  const gold = useGoldState()

  const handleUp = (e: React.MouseEvent) => {
    setDays((d) => d + 1)
    e.stopPropagation()
  }

  const handleDown = (e: React.MouseEvent) => {
    setDays((d) => d - 1)
    e.stopPropagation()
  }

  const setRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(+e.target.value ?? 0)
  }

  const canExtend = days * LODGE_COST <= gold

  const handleExtend = () => {
    if (!canExtend) {
      return
    }
    dispatch(extendAdventurerLodging(roomLodging.adventurer, days))
    TooltipEmitter.clear()
  }

  const handleClickIntercept = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div onClick={handleClickIntercept} className="extend-lodging-modal">
      <h3>Extend stay</h3>
      <div>
        {adventurer.name} is currently lodged for
      </div>
      <div>
        {formatDays(ms)}
      </div>
      <div className="days">
        <div>
          Days:
        </div>
        <input
          type="range"
          min="0"
          value={days}
          onChange={setRange}
        />
        <NumberDial
          value={days}
          onUp={handleUp}
          onDown={handleDown}
          downDisabled={days <= 0}
          upDisabled={days >= 100}
        />
      </div>
      <div>

      </div>
      <Button
        className="button-extend"
        onClick={handleExtend}
        disabled={!canExtend}
      >
        <div>
          Extend
        </div>
        <GoldAmount amount={LODGE_COST * days} disabled={!canExtend} />

        {/* { TextManager.get('ui-structure-help-upgrade-start', {
          time: formatDuration(time ?? 0)
        })} */}
      </Button>
    </div>
  )
}

export default ExtendLodgingHelpModal
