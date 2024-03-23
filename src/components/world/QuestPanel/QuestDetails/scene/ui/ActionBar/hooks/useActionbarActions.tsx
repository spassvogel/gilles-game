import { useCallback, useContext, useMemo, useState } from 'react'
import * as TextManager from 'global/TextManager'
import { type ActionIntent } from '../../SceneUI'
import { type AdventurerObject, SceneActionType, isAdventurer } from 'store/types/scene'
import { WeaponAbility } from 'definitions/abilities/types'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { AP_COST_CONSUME } from 'mechanics/combat'
import { useQuestScene } from 'hooks/store/quests'

const useActionbarActions = (
  onSetActionIntent: (intent?: ActionIntent) => void,
  activeIntent?: ActionIntent
) => {
  const [secondary, setSecondary] = useState<string | null>(null)
  const controller = useContext(SceneControllerContext)

  if (controller == null) {
    throw new Error('No controller found...')
  }
  const scene = useQuestScene(controller.questName)
  const adventurerObject = useMemo<AdventurerObject | null>(() => {
    // we have to find the object from the redux store. because the ap can be updated since first selections
    if (activeIntent == null) {
      return null
    }
    const actor = activeIntent.actor as AdventurerObject
    const found = scene?.objects.find((o) => isAdventurer(o) && o.adventurerId === actor.adventurerId) as AdventurerObject
    return found
  }, [activeIntent, scene?.objects])

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
        return (
          <>
            {TextManager.get('ui-adventurer-action-bar-move')}
            {' '}
            {TextManager.get('ui-adventurer-info-use-item-ap-cost', { ap: activeIntent?.apCost })}
          </>
        )
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
            {TextManager.get('ui-adventurer-info-use-item-ap-cost', { ap: activeIntent?.apCost })}
          </>
        )
      }
      case SceneActionType.consume: {
        return (
          <>
            {TextManager.get('ui-adventurer-action-bar-consume')}
            {' '}
            {TextManager.get('ui-adventurer-info-use-item-ap-cost', { ap: AP_COST_CONSUME })}
          </>
        )
      }
    }
  }, [activeIntent])

  let buttonVisible = true
  if (secondary === 'potion' && activeIntent === undefined) {
    buttonVisible = false
  }

  const buttonDisabled = useMemo(() => {
    if (activeIntent == null || adventurerObject == null) {
      return true
    }
    switch (activeIntent.action) {
      case SceneActionType.move:
      case SceneActionType.melee:
      case SceneActionType.shoot: {
        return activeIntent.apCost > adventurerObject.ap
      }
      case SceneActionType.consume: {
        return adventurerObject.ap < AP_COST_CONSUME
      }
    }
    return false
  }, [activeIntent, adventurerObject])

  return {
    secondary,
    buttonText,
    buttonVisible,
    buttonDisabled,
    doAction,
    selectPrimaryCombatAction,
    openSecondaryActionBar
  }
}

export default useActionbarActions
