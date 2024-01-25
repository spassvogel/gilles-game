import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import { IconSize } from 'components/ui/common/Icon'
import Select from 'components/ui/common/Select'
import * as TextManager from 'global/TextManager'
import { useAdventurers } from 'hooks/store/adventurers'
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { groupAdventurersByQuest } from 'store/selectors/adventurers'
import { type StoreState } from 'store/types'
import { type AdventurerStoreState } from 'store/types/adventurer'
import AdventurersOverview from './AdventurersOverview'
import DebugAdventurerEdit from './DebugAdventurerEdit'

import './styles/debugAdventurers.scss'

type Options = {
  value: string
  label: string
}

const DebugAdventurers = () => {
  const [selectedId, setSelectedId] = useState<string | null>()
  const adventurers = useAdventurers()
  const quests = useSelector((state: StoreState) => state.quests)

  const items = useMemo(() => {
    const groupedAdventurers = groupAdventurersByQuest(adventurers, quests)
    return Object.keys(groupedAdventurers).map((groupKey: string) => {
      const adventurersInGroup = groupedAdventurers[groupKey]
      const title = groupKey === 'solo' ? 'solo' : TextManager.getQuestTitle(groupKey)
      return {
        label: title,
        options: adventurersInGroup.map((adventurer: AdventurerStoreState) => ({
          adventurer,
          value: adventurer.id,
          label: title
        })
        )
      }
    })
  }, [adventurers, quests])

  return (
    <div className="debug-adventurers">

    <Select<Options, false>
      className="adventurer-list"
      classNamePrefix="adventurer-list"
      placeholder={'Adventurers (grouped by quest)'}
      onChange={(e) => { setSelectedId(e?.value) }}
      formatGroupLabel={(data) => (
        <div className="item-group">
          <div className="item-group-label">{data.label}</div>
          <div className="item-group-count">{data.options.length} adventurers</div>
        </div>
      )}
      formatOptionLabel={(option) => {
        const adventurer = adventurers.find(a => a.id === option.value)
        if (adventurer == null) return null
        return (
          <div className="item-option">
            <AdventurerAvatar adventurer={adventurer} size={IconSize.smallest} />
            <div className="item-label">
              {adventurer.name}
            </div>
          </div>
        )
      }}
      options={items} />
      { selectedId && (
        <DebugAdventurerEdit adventurerId={selectedId} />
      )}
      {!selectedId && (
        <AdventurersOverview onSetSelectedId={setSelectedId} />
      )}
    </div>
  )
}

export default DebugAdventurers
