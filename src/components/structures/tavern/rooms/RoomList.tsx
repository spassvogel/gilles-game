import { useState } from 'react'
import { useSelector } from 'react-redux'
import * as TextManager from 'global/TextManager'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type QuestStoreState } from 'store/types/quest'
import { type StoreState } from 'store/types'
import { type TavernStructureState } from 'store/types/structure'
import RoomWithAdventurer from './RoomWithAdventurer'
import RoomEmpty from './RoomEmpty'

import './styles/roomList.scss'

export type Props = {
  roomCount: number
  assignedAventurers: AdventurerStoreState[]
  quests: QuestStoreState[]
  selectedQuestName?: string // name of selected quest

  onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
}

const RoomList = (props: Props) => {
  const {
    roomCount,
    assignedAventurers,
    selectedQuestName,
    onAddAdventurer,
    onRemoveAdventurer
  } = props
  const [selectedAdventurer, setSelectedAdventurer] = useState<string>()
  const { lodging } = useSelector<StoreState, TavernStructureState>(store => store.structures.tavern)

  const handleAdventurerClick = (adventurer: AdventurerStoreState) => {
    if (selectedAdventurer === adventurer.id) {
      setSelectedAdventurer(undefined)
    } else {
      setSelectedAdventurer(adventurer.id)
    }
  }

  const getRoomContent = (roomIndex: number) => {
    const roomLodging = lodging[roomIndex]
    if (roomLodging == null) {
      return (
        <RoomEmpty key={`room${roomIndex}`} />
      )
    }

    return (
      <RoomWithAdventurer
        key={`room${roomIndex}`}
        roomLodging={roomLodging}
        assignedAventurers={assignedAventurers}
        selectedQuestName={selectedQuestName}
        expanded={selectedAdventurer === roomLodging.adventurer}

        onClick={handleAdventurerClick}
        onAddAdventurer={onAddAdventurer}
        onRemoveAdventurer={onRemoveAdventurer}
      />
    )
  }

  const roomContent: JSX.Element[] = []
  for (let i = 0; i < roomCount; i++) {
    roomContent.push(getRoomContent(i))
  }

  return (
    <div className="room-list">
      <h2>{TextManager.get('ui-structure-tavern-rooms')}</h2>
      { roomContent }
    </div>
  )
}

export default RoomList
