import { type AdventurerStoreState } from 'store/types/adventurer'
import { SOURCE_ID } from '../TavernStructureView'
import AdventurerButton from './AdventurerButton'
import * as TextManager from 'global/TextManager'
import DraggableAdventurerAvatar from 'components/ui/adventurer/DraggableAdventurerAvatar'
import AdventurerPanel from 'components/ui/adventurer/AdventurerPanel'
import { type TavernRoomLodging } from 'store/types/structure'
import { useAdventurer } from 'hooks/store/adventurers'
import { useActiveQuests } from 'hooks/store/quests'
import { formatDateTime } from 'utils/format/time'
import ExtendLodgingButton from './ExtendLodgingButton'

import './styles/tavernAdventurerDetails.scss'
import './styles/roomWithAdventurer.scss'

export type Props = {
  assignedAventurers: AdventurerStoreState[]
  expanded: boolean
  selectedQuestName?: string
  roomLodging: TavernRoomLodging

  onClick: (adventurer: AdventurerStoreState) => void
  onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
}

// Room block that has adventurer
const RoomWithAdventurer = (props: Props) => {
  const {
    roomLodging,
    assignedAventurers,
    expanded,
    selectedQuestName,
    onClick,
    onAddAdventurer,
    onRemoveAdventurer
  } = props

  const quests = useActiveQuests()
  const getQuestByAdventurer = (adventurerId: string) => {
    return Object.values(quests).find((quest) => {
      return quest.party.includes(adventurerId)
    })
  }

  const adventurer = useAdventurer(roomLodging.adventurer)
  const assigned = assignedAventurers.includes(adventurer) // assigned to a quest in the QuestBoard
  const onQuest = getQuestByAdventurer(adventurer.id) != null

  // todo: enable this somewhere else at some point
  // const dispatch = useDispatch()
  // const handleRename = (e: React.MouseEvent<HTMLSpanElement>) => {
  //   e.stopPropagation()
  //   const name = prompt('Enter new name', adventurer.name)
  //   if (name !== null && name !== adventurer.name) {
  //     dispatch(renameAdventurer(adventurer.id, name))
  //   }
  // }

  return (
    <>
      <div
        className={`room ${expanded ? 'expanded' : ''}`}
        onClick={() => { onClick(adventurer) }}
      >
        <DraggableAdventurerAvatar
          disabled={assigned || onQuest}
          adventurer={adventurer}
          className="adventurer-icon"
          sourceId={SOURCE_ID}
          key={`avatar:${adventurer.id}`}
        />
        <div className="room-content">
          <section>
            {adventurer.name}
          </section>
          <section className="lodged-until">
            <div className="date">
              {formatDateTime(roomLodging.paidUntil)}
            </div>
            <ExtendLodgingButton roomLodging={roomLodging} />
          </section>
          <section className="on-a-quest">
           {(onQuest) && TextManager.get('ui-structure-tavern-on-a-quest') }
          </section>
        </div>
        {/* <span className="rename" onClick={handleRename}>rename</span> */}
      </div>
      { expanded && (
        <div className="adventurer-details tavern-adventurer-details">
          <AdventurerPanel adventurerId={adventurer.id} name={false} />
          { (!onQuest && selectedQuestName !== undefined) && (
            <AdventurerButton
              adventurer={adventurer}
              assignedAventurers={assignedAventurers}
              questName={selectedQuestName}
              onAddAdventurer={onAddAdventurer}
              onRemoveAdventurer={onRemoveAdventurer}
            />
          )}
        </div>
      )}
    </>
  )
}

export default RoomWithAdventurer
