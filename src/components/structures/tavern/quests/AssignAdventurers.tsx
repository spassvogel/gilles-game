import { type AdventurerStoreState } from 'store/types/adventurer'
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import { type AdventurerAvatarDragInfo } from 'components/ui/adventurer/DraggableAdventurerAvatar'
import DroppableAdventurerSlot from 'components/ui/adventurer/DroppableAdventurerSlot/DroppableAdventurerSlot'
import { IconSize } from 'components/ui/common/Icon'
import './styles/assignadventurers.scss'

export type DispatchProps = {
  onAdventurerDropped: (item: AdventurerAvatarDragInfo, index: number) => void
  onAdventurerClicked: (adventurer: AdventurerStoreState) => void
}

export type Props = {
  availableSlots: number
  assignedAventurers: AdventurerStoreState[]
}

/*
 * Displays a number of slots to drag adventurers to */
const AssignAdventurers = (props: Props & DispatchProps) => {
  const slotsContent = () => {
    const slots: JSX.Element[] = []
    for (let i = 0; i < props.availableSlots; i++) {
      let content
      let className = ''
      const hasAdventurer = props.assignedAventurers[i] !== undefined

      if (hasAdventurer) {
        const adventurer = props.assignedAventurers[i]
        content = (
          <AdventurerAvatar
            adventurer={adventurer}
            size={IconSize.small}
            onClick={() => { props.onAdventurerClicked(adventurer) } }
          />
        )
        className = 'has-adventurer'
      } else {
        content = (
          <DroppableAdventurerSlot
            onDrop={(item: AdventurerAvatarDragInfo) => { props.onAdventurerDropped(item, i) }}
          />
        )
      }
      slots.push(
        <li
          key={`slot${i}`}
          className={className}
        >
          {content}
        </li>
      )
    }
    return slots
  }

  return (
    <ul className="assign-adventurers">
      { slotsContent() }
    </ul>
  )
}

export default AssignAdventurers
