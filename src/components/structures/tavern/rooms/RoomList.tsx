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
  adventurers: AdventurerStoreState[]
  assignedAventurers: AdventurerStoreState[]
  quests: QuestStoreState[]
  selectedQuestName?: string // name of selected quest

  onAddAdventurer: (adventurer: AdventurerStoreState, index: number) => void
  onRemoveAdventurer: (adventurer: AdventurerStoreState) => void
}

const RoomList = (props: Props) => {
  const {
    roomCount,
    adventurers,
    assignedAventurers,
    selectedQuestName,
    onAddAdventurer,
    onRemoveAdventurer
  } = props
  const [selectedAdventurer, setSelectedAdventurer] = useState<string>()
  const { lodging } = useSelector<StoreState, TavernStructureState>(store => store.structures.tavern)

  const getQuestByAdventurer = (adventurerId: string): QuestStoreState | undefined => {
    return Object.values(props.quests).find((quest) => {
      return quest.party.includes(adventurerId)
    })
  }

  const handleAdventurerClick = (adventurer: AdventurerStoreState) => {
    if (selectedAdventurer === adventurer.id) {
      setSelectedAdventurer(undefined)
    } else {
      setSelectedAdventurer(adventurer.id)
    }
  }

  const roomContent: JSX.Element[] = []
  for (let i = 0; i < roomCount; i++) {
    const adventurer = adventurers.find((a) => a.id === lodging[i]?.adventurer)

    if (adventurer == null) {
      roomContent.push((
        <RoomEmpty key={`room${i}`} />
      ))
      continue
    }

    const onQuest = !(getQuestByAdventurer(adventurer.id) == null)

    roomContent.push((
      <RoomWithAdventurer
        key={adventurer.id}
        adventurer={adventurer}
        assignedAventurers={assignedAventurers}
        selectedQuestName={selectedQuestName}
        expanded={selectedAdventurer === adventurer.id}
        onQuest={onQuest}

        onClick={handleAdventurerClick}
        onAddAdventurer={onAddAdventurer}
        onRemoveAdventurer={onRemoveAdventurer}
      />
    ))
  }

  return (
    <div className="room-list">
      <h2>{TextManager.get('ui-structure-tavern-rooms')}</h2>
      { roomContent }
    </div>
  )
}

export default RoomList
