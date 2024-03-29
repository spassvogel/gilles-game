import { useCallback } from 'react'
import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { type StructureStoreState } from 'store/types/structure'
import { getDefinition, type Structure } from 'definitions/structures'
import { type StructureDefinition, type StructureLevelDefinition } from 'definitions/structures/types'

// Returns the structure state from redux store
export const useStructureState = <T extends StructureStoreState>(structure: Structure): T => {
  const structureSelector = useCallback(
    (state: StoreState) => state.structures[structure] as T,
    [structure]
  )
  return useSelector<StoreState, T>(structureSelector)
}

export const useStructureDefinition = <T extends StructureDefinition>(structure: Structure): T => {
  const structureDefinition = getDefinition<T>(structure)
  if (structureDefinition == null) {
    throw new Error(`No definition found for structure ${structure}.`)
  }
  return structureDefinition
}

export const useStructureLevel = <T extends StructureLevelDefinition>(structure: Structure): T => {
  const { level } = useStructureState(structure)
  const structureDefinition = useStructureDefinition(structure)
  return structureDefinition.levels[level] as T
}
