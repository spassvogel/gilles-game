import { getDefinition as getStructureDefinition, type Structure } from 'definitions/structures'
import { StructureState, type StructureStoreState } from 'store/types/structure'
import { type StructuresStoreState } from 'store/types/structures'
import * as TextManager from 'global/TextManager'
import { ToastManager } from 'global/ToastManager'
import { Type } from 'components/ui/toasts/Toast'
import { useDispatch, useSelector } from 'react-redux'
import { setStructureState } from 'store/actions/structures'
import { type StoreState } from 'store/types'
import './styles/debugContextTown.scss'

const DebugContextTown = () => {
  const dispatch = useDispatch()
  const structures = useSelector<StoreState, StructuresStoreState>(store => store.structures)

  const onCheatStructureState = (structure: Structure, state: StructureState) => {
    dispatch(setStructureState(structure, state))
  }

  const handleChangeStructureState = (structure: Structure, checked: boolean) => {
    onCheatStructureState(structure, checked ? StructureState.Built : StructureState.NotBuilt)
    if (checked) {
      ToastManager.addToast(`The ${TextManager.getStructureName(structure)} is constructed`, Type.cheat)
    } else {
      ToastManager.addToast(`The ${TextManager.getStructureName(structure)} is not constructed`, Type.cheat)
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
  return (
    <div className="debug-context-town">
    <h2>Structures</h2>
      <div className="structures">
        { Object.keys(structures).map((structure) => getStructureRow(structure as Structure))}
      </div>
    </div>
  )
}

export default DebugContextTown
