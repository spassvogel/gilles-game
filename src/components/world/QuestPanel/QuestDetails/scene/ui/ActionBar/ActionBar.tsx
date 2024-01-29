import { useContext, useEffect, useMemo, useRef } from 'react'
import { type Location } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { useAdventurer } from 'hooks/store/adventurers'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type EnemyObject, isEnemy, SceneActionType, type ActorObject } from 'store/types/scene'
import { type ActionIntent } from '../SceneUI'
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import EnemyAvatar from 'components/ui/enemy/EnemyAvatar'
import { IconSize } from 'components/ui/common/Icon'
import { WeaponAbility } from 'definitions/abilities/types'
import useDraggable from 'hooks/store/useDraggable'
import Button from 'components/ui/buttons/Button'
import ActionButton from './ActionButton'

import './styles/actionBar.scss'
import { ContextType } from 'constants/context'
import { TooltipEmitter } from 'emitters/TooltipEmitter'

type Props = {
  adventurerId: string
  location: Location
  activeIntent?: ActionIntent
  intents: ActionIntent[]
  onClose: () => void
  onSetActionIntent: (intent?: ActionIntent) => void
}

const ActionMenu = (props: Props) => {
  const {
    adventurerId,
    location,
    intents,
    onClose,
    onSetActionIntent,
    activeIntent
  } = props
  const adventurer: AdventurerStoreState = useAdventurer(adventurerId)
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller')

  const ref = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  // useDraggable(ref, handle)

  const enemyTargetted = useMemo(() => {
    const [object] = controller?.getObjectsAtLocation(location, isEnemy) ?? []
    return object as EnemyObject
  }, [controller, location])

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
            ({activeIntent !== undefined && JSON.stringify(activeIntent?.apCost)}AP)
          </>
        )
      }
    }
  }, [activeIntent])

  const doAction = () => {
    if (activeIntent != null) {
      controller?.actorAttemptAction(activeIntent)
      onClose()
    }
  }

  useEffect(() => {
    return () => {
      onSetActionIntent(undefined)
    }
  }, [onSetActionIntent])

  const openTooltip = (e: React.MouseEvent<HTMLDivElement>, object: ActorObject) => {
    const origin = (e.currentTarget as HTMLElement)
    const originRect = origin.getBoundingClientRect()

    TooltipEmitter.showContextTooltip(ContextType.actor, object, originRect, '')
    e.stopPropagation()
  }

  const handleAdventurerPortraitClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const sceneObject = controller.sceneAdventurers.find(sA => sA.adventurerId === adventurerId)
    if (sceneObject == null) {
      return
    }
    openTooltip(e, sceneObject)
  }

  const handleEnemyPortraitClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const [object] = controller?.getObjectsAtLocation(location, isEnemy) ?? []
    openTooltip(e, object as ActorObject)
  }

  return (
    <div className="action-bar-background" >
      <div className="action-bar" ref={ref}>
        <div className="background" ref={handle}>
          <div className="actors">
            <div onClick={handleAdventurerPortraitClick}>
              <AdventurerAvatar
                adventurer={adventurer}
                size={IconSize.big}
              />
            </div>
            <div onClick={handleEnemyPortraitClick}>
              {enemyTargetted?.enemyType !== undefined && (
                <EnemyAvatar actorObject={enemyTargetted} size={IconSize.big}/>
              )}
            </div>
          </div>
          <div className="actions">
            {intents.filter(i => i.isValid).map((intent, i) => (
              <ActionButton
                key={`${intent.action}${i}`}
                adventurer={adventurer}
                location={location}
                intent={intent}
                active={intent.action === activeIntent?.action}
                onSetActionIntent={onSetActionIntent}
              />
            ))}
          </div>

          <Button size="medium" onClick={doAction}>
            {buttonText}
          </Button>
          <div className="button-close" onClick={onClose}>x</div>
        </div>
      </div>
    </div>
  )
}

export default ActionMenu
