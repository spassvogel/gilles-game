import { useCallback, useContext, useMemo, useState } from 'react'
import { type ActionIntent } from '../../SceneUI'
import { SceneActionType } from 'store/types/scene'
import { WeaponAbility } from 'definitions/abilities/types'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'

const useActionbarActions = (
  onSetActionIntent: (intent?: ActionIntent) => void,
  activeIntent?: ActionIntent
) => {
  const [secondary, setSecondary] = useState<string | null>(null)
  const controller = useContext(SceneControllerContext)

  const selectPrimaryCombatAction = useCallback((intent: ActionIntent) => {
    onSetActionIntent(intent)
    setSecondary(null)
  }, [onSetActionIntent])

  const openSecondaryActionBar = useCallback((type: string) => {
    onSetActionIntent(undefined)
    setSecondary(type)
  }, [onSetActionIntent])

  const doAction = () => {
    if (activeIntent != null) {
      controller?.actorAttemptAction(activeIntent)
      // onClose()
    }
  }

  const buttonText = useMemo(() => {
    if (activeIntent === undefined) {
      return ''
    }

    switch (activeIntent.action) {
      case SceneActionType.move: {
        return `Move (${activeIntent.apCost} AP)`
      }
      case SceneActionType.melee:
      case SceneActionType.shoot: {
        if (activeIntent.weaponWithAbility == null) {
          return undefined
        }
        return (
          <>
            {WeaponAbility[activeIntent.weaponWithAbility.ability]}
            {' '}
            ({activeIntent?.apCost}AP)
          </>
        )
      }
      case SceneActionType.consume: {
        return 'drink dat shit'
      }
    }
  }, [activeIntent])

  return {
    secondary,
    buttonText,
    doAction,
    selectPrimaryCombatAction,
    openSecondaryActionBar
  }
}

export default useActionbarActions
