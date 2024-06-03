import { type TavernRoomLodging } from 'store/types/structure'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import { ContextType } from 'constants/context'
import ExtendLodgingHelpModal from './ExtendLodgingHelpModal'

export type Props = {
  roomLodging: TavernRoomLodging
}

const ExtendLodgingButton = (props: Props) => {
  const { roomLodging } = props

  const handleHelpClicked = (event: React.MouseEvent) => {
    const origin = (event.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()
    const content = (
      <ExtendLodgingHelpModal roomLodging={roomLodging}/>
    )
    TooltipEmitter.showContextTooltip(ContextType.component, content, originRect, 'upgrade-structure-tooltip')

    event.stopPropagation()
  }

  return (
    <>
      <div onClick={handleHelpClicked} className="button">
        extend
      </div>
    </>
  )
}

export default ExtendLodgingButton
