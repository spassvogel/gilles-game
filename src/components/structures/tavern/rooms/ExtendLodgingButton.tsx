import NumberDial from 'components/ui/common/NumberDial'
import GoldAmount from 'components/ui/gold'
import useGoldState from 'hooks/store/useGoldState'
import { LODGE_COST } from 'mechanics/tavern'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { extendAdventurerLodging } from 'store/actions/structures'
import { type TavernRoomLodging } from 'store/types/structure'

export type Props = {
  roomLodging: TavernRoomLodging
}

const ExtendLodgingButton = (props: Props) => {
  const { roomLodging } = props
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

  const handleExtend = (e: React.MouseEvent) => {
    if (!canExtend) {
      return
    }
    dispatch(extendAdventurerLodging(roomLodging.adventurer, days))
    e.stopPropagation()
  }

  const canExtend = days * LODGE_COST <= gold

  return (
    <>
      <NumberDial
        value={days}
        onUp={handleUp}
        onDown={handleDown}
        downDisabled={days <= 0}
        />
      <div
        className={!canExtend ? 'disabled' : ''}
        onClick={handleExtend}
      >
        extend{' '}
        <GoldAmount amount={LODGE_COST * days} disabled={!canExtend} />
      </div>
    </>
  )
}

export default ExtendLodgingButton
