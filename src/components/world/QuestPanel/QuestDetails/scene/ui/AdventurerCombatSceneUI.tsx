import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import CombatUIWidget from './CombatUIWidget'
import useActionIntents from './hooks/useActionIntents'
import { type Location } from 'utils/tilemap'
import { type ActionIntent } from './SceneUI'
import ActionBar from './ActionBar/ActionBar'

type Props = {
  selectedAdventurerId: string
  cursorLocation: Location
  visible: boolean
  setCursorLocation: (location?: Location) => void
  actionIntent?: ActionIntent
  onSetActionIntent: (intent?: ActionIntent) => void
}

export type Refs = {
  actionMenuOpen: boolean
  onMouseUp: () => void
}

// part of the UI that is shown when an adventurer is selected and the scene is in combat
const AdventurerCombatSceneUI = forwardRef<Refs, Props>((props: Props, ref) => {
  const {
    selectedAdventurerId,
    cursorLocation,
    visible,
    setCursorLocation,
    onSetActionIntent,
    actionIntent
  } = props
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const combatIntents = useActionIntents(selectedAdventurerId, cursorLocation)

  const handleCloseActionMenu = () => {
    setActionMenuOpen(false)
    setCursorLocation(undefined)
  }

  const onMouseUp = useCallback(() => {
    // open action
    const hasValidIntents = !(combatIntents.length === 0) && combatIntents.some(i => i.isValid)
    if (cursorLocation != null && hasValidIntents) {
      const firstValidIntent = combatIntents.find((i) => i.isValid)
      onSetActionIntent(firstValidIntent)
      setActionMenuOpen(true)
    } else {
      setCursorLocation(undefined)
      onSetActionIntent(undefined)
      setActionMenuOpen(false)
    }
  }, [combatIntents, cursorLocation, onSetActionIntent, setCursorLocation])

  useImperativeHandle(ref, () => {
    return {
      actionMenuOpen,
      onMouseUp
    }
  })

  return (
    <>
      { visible && <CombatUIWidget
        location={cursorLocation}
        intents={combatIntents}
        selectedActorId={selectedAdventurerId}
      />}
      { (actionMenuOpen && cursorLocation != null && combatIntents != null) && (
        <ActionBar
          adventurerId={selectedAdventurerId}
          location={cursorLocation}
          activeIntent={actionIntent}
          intents={combatIntents}
          onClose={handleCloseActionMenu}
          onSetActionIntent={onSetActionIntent}
        />
      )}
    </>
  )
})
AdventurerCombatSceneUI.displayName = 'AdventurerCombatSceneUI'
export default AdventurerCombatSceneUI
