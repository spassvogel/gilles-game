import { useEffect, useMemo, useState } from 'react'
import allItems, { getDefinition } from 'definitions/items'
import { type ItemType, ItemCategory } from 'definitions/items/types'
import { getDefinition as getStructureDefinition, type Structure } from 'definitions/structures'
import { StructureState, type StructureStoreState } from 'store/types/structure'
import { type StructuresStoreState } from 'store/types/structures'
import * as TextManager from 'global/TextManager'
import { ToastEmitter } from 'emitters/ToastEmitter'
import { Type } from 'components/ui/toasts/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { addLogText } from 'store/actions/log'
import { LogChannel } from 'store/types/logEntry'
import { resourceOrder } from 'constants/resources'
import { type ResourceStoreState } from 'store/types/resources'
import { addResources } from 'store/actions/resources'
import { setStructureState } from 'store/actions/structures'
import { type StoreState } from 'store/types'
import { addGold } from 'store/actions/gold'
import { addItemToWarehouse } from 'store/actions/stockpile'
import { getTimeMultiplier, setCheatTimeMultiplier, TimeType } from 'mechanics/time'
import ItemIcon from 'components/ui/items/ItemIcon'
import { IconSize } from 'components/ui/common/Icon'
import Button from 'components/ui/buttons/Button'
import Select from 'components/ui/common/Select'
import { addWorkers } from 'store/actions/workers'
import Window from '../Window'

import './styles/cheat.scss'

type Options = {
  label: ItemCategory
  value: string
  subtext: string
}

const CheatWindow = () => {
  const [cheats, setCheats] = useState({
    gold: 50,
    resources: 50,
    workers: 10
  })
  const [selectedItem, setSelectedItem] = useState<string | null>()
  const dispatch = useDispatch()
  const [timeMultiplier, setTimeMultiplier] = useState(getTimeMultiplier(TimeType.cheat))

  const onCheatGold = (amount: number) => {
    dispatch(addGold(amount))
    dispatch(addLogText('common-cheat-gold-added', { amount }, LogChannel.common))
  }

  const onCheatItem = (type: ItemType) => {
    const item = { type }
    dispatch(addItemToWarehouse(item))
    dispatch(addLogText('common-cheat-item-added', { item }, LogChannel.common))
  }

  const onCheatResources = (amount: number) => {
    // Create ResourceStoreState where value of each resource is `amount`
    const resources = resourceOrder.reduce((acc: ResourceStoreState, resource) => {
      acc[resource] = amount
      return acc
    }, {})

    dispatch(addResources(resources))
    dispatch(addLogText('common-cheat-resources-added', { amount }, LogChannel.common))
  }

  const onCheatStructureState = (structure: Structure, state: StructureState) => {
    dispatch(setStructureState(structure, state))
  }

  const onCheatWorkers = (amount: number) => {
    dispatch(addWorkers(amount))
    dispatch(addLogText('common-cheat-workers-added', { amount }, LogChannel.common))
  }

  const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures)

  const handleChangeStructureState = (structure: Structure, checked: boolean) => {
    onCheatStructureState(structure, checked ? StructureState.Built : StructureState.NotBuilt)
    if (checked) {
      ToastEmitter.addToast(`The ${TextManager.getStructureName(structure)} is constructed`, Type.cheat)
    } else {
      ToastEmitter.addToast(`The ${TextManager.getStructureName(structure)} is not constructed`, Type.cheat)
    }
  }

  const getStructureRow = (structure: Structure) => {
    const structureDef = getStructureDefinition(structure)
    const structureStore: StructureStoreState = structures[structure]
    const levelDef = structureDef.levels[structureStore.level]

    const displayName = TextManager.get(levelDef.displayName)

    return (
      <div
        className="label-dropdown"
        key={structure}
      >
        <label title={structure}>
          {`${displayName}`}
        </label>
        <input
          key={structure}
          type="checkbox"
          checked={structureStore.state === StructureState.Built}
          onChange={() => { handleChangeStructureState(structure, structureStore.state !== StructureState.Built) }}
        />
      </div>
    )
  }

  const handleCheatGold = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    const amount = cheats.gold
    onCheatGold(amount)

    const text = TextManager.get('common-cheat-gold-added', { amount })
    const icon = 'img/resources/gold.png'
    ToastEmitter.addToast(text, Type.cheat, icon)
  }

  const handleCheatWorkers = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    const amount = cheats.workers
    onCheatWorkers(amount)
    const text = TextManager.get('common-cheat-workers-added', { amount })
    const icon = 'img/resources/worker.png'
    ToastEmitter.addToast(text, Type.cheat, icon)
  }

  const handleCheatResources = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    onCheatResources(cheats.resources)
    const text = TextManager.get('common-cheat-resources-added', { amount: cheats.resources })
    ToastEmitter.addToast(text, Type.cheat)
  }

  const handleCheatItem = (_evt: React.MouseEvent<HTMLButtonElement>) => {
    const item = selectedItem as ItemType
    onCheatItem(item)

    const text = TextManager.get('common-cheat-item-added', { item })
    const icon = getDefinition(item).iconImg
    ToastEmitter.addToast(text, Type.cheat, icon)
  }

  const handleChangeGold = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number.parseFloat(event.target.value)
    setCheats({
      ...cheats,
      gold: amount
    })
  }

  const handleChangeWorkers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number.parseFloat(event.target.value)
    setCheats({
      ...cheats,
      workers: amount
    })
  }

  const handleChangeResources = (event: React.ChangeEvent<HTMLInputElement>) => {
    const amount = Number.parseFloat(event.target.value)
    setCheats({
      ...cheats,
      resources: amount
    })
  }

  const handleChangeTimeMultiplier = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(event.target.value)
    setTimeMultiplier(value)
    setCheatTimeMultiplier(value)
  }

  const items = useMemo(() => (Object.keys(ItemCategory)
    .filter(k => !isNaN(parseInt(k))) // such a weird way to unumerate an enum.. sigh
    .map((typeKey: string) => {
      const type = ItemCategory[typeKey as unknown as number] as unknown as ItemCategory
      return {
        label: type as unknown as ItemCategory,
        value: '',
        subtext: '',
        options: Object.keys(allItems)
          // eslint-disable-next-line eqeqeq
          .filter((item: string) => getDefinition(item as ItemType).itemCategory as unknown as string == typeKey)
          .map((item: string) => ({
            value: item,
            label: TextManager.getItemName(item as ItemType),
            subtext: TextManager.getItemSubtext(item as ItemType)
          })
          )
      }
    })
  ), [])

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      TextManager.printNotFounds()
    }
  }, [])

  return (
    <Window title={TextManager.get('ui-window-title-cheats')}>
      <div className="cheat-window">
        <div className="label-numberbox-button">
          <label>Gold</label>
          <input type="number"
            value={cheats.gold}
            style={{ width: '50px' }}
            onChange={handleChangeGold} />
          <button onClick={handleCheatGold}>Add</button>
        </div>
        <div className="label-numberbox-button">
          <label>Workers</label>
          <input type="number"
            value={cheats.workers}
            style={{ width: '50px' }}
            onChange={handleChangeWorkers} />
          <button onClick={handleCheatWorkers}>Add</button>
        </div>
        <div className="label-numberbox-button">
          <label>Resources</label>
          <input type="number"
            value={cheats.resources}
            style={{ width: '50px' }}
            onChange={handleChangeResources} />
          <button onClick={handleCheatResources}>Add</button>
        </div>
        <div className="label-numberbox-button">
          <label>Items</label>
          <Select<Options, false>
            placeholder={'Find item in any category...'}
            onChange={(e) => { setSelectedItem(e?.value) }}
            formatGroupLabel={(data) => (
              <div className="item-group">
                <div className="item-group-label">{data.label}</div>
                <div className="item-group-count">{data.options.length} items</div>
              </div>
            )}
            formatOptionLabel={option => (
              <div className="item-option">
                <ItemIcon item={ { type: option.value as ItemType }} size={IconSize.smallest} />
                <div className="item-label">
                  {option.label}
                  <span>{(option as unknown as { subtext: string }).subtext}</span>
                </div>
              </div>
            )}
            options={items} />
          <Button onClick={handleCheatItem}>Add</Button>
        </div>
        <div className="label-range-value">
          <label>Speed</label>
          <input
            type="range"
            min="1" max="10" value={timeMultiplier} step={1}
            onChange={handleChangeTimeMultiplier}
          />
          {timeMultiplier}x speed
        </div>
        <div>
          <h2>Structures</h2>
        </div>
        { Object.keys(structures).map((structure) => getStructureRow(structure as Structure))}
      </div>
    </Window>
  )
}

export default CheatWindow
