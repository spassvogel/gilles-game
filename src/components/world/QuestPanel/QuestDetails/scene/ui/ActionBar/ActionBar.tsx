import { useContext, useEffect, useMemo, useRef } from 'react'
import { type Location } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { useAdventurer } from 'hooks/store/adventurers'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type EnemyObject, isEnemy, type ActorObject } from 'store/types/scene'
import { type ActionIntent } from '../SceneUI'
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import EnemyAvatar from 'components/ui/enemy/EnemyAvatar'
import { IconSize } from 'components/ui/common/Icon'
import Button from 'components/ui/buttons/Button'
import CombatActionButton from './buttons/CombatActionButton'

import { ContextType } from 'constants/context'
import { TooltipEmitter } from 'emitters/TooltipEmitter'
import PotionActionButton from './buttons/PotionActionButton'
import PotionSecondaryActionBar from './secondary/PotionSecondary'
import useActionbarActions from './hooks/useActionbarActions'

import './styles/actionBar.scss'

type Props = {
  adventurerId: string
  location: Location
  activeIntent?: ActionIntent
  intents: ActionIntent[]
  onClose: () => void
  onSetActionIntent: (intent?: ActionIntent) => void
}

const ActionBar = (props: Props) => {
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
  const {
    secondary,
    buttonVisible,
    buttonDisabled,
    buttonText,
    doAction,
    selectPrimaryCombatAction,
    openSecondaryActionBar
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  } = useActionbarActions(onSetActionIntent, activeIntent)

  if (controller == null) throw new Error('No controller')

  const ref = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  const enemyTargetted = useMemo(() => {
    const [object] = controller?.getObjectsAtLocation(location, isEnemy) ?? []
    return object as EnemyObject
  }, [controller, location])

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

  // todo: fix up
  // useEffect(() => {
  //   document.addEventListener('dragstart', function (event) {
  //     // event.dataTransfer.setData("text/plain", event.target.style.cursor = "move");
  //     event.target.style.transform = document.querySelector('.scene-ui').style.transform
  //     bgRef.current.classList.add('dragging')
  //   })

  //   ref.current!.addEventListener('drag', (e) => {
  //     // e.target.style.display = 'initial'
  //   })
  //   ref.current!.addEventListener('dragend', (event) => {
  //     // event.target.style.display = 'block'
  //     event.target.style.transform = ''
  //     bgRef.current.classList.remove('dragging')
  //   })

  //   // By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
  //   bgRef.current?.querySelectorAll('[data-drop-area]').forEach((el) => {
  //     el.addEventListener('dragover', (event) => {
  //       event.dataTransfer.dropEffect = 'move'
  //       event.dataTransfer.effectAllowed = 'move'
  //       event.preventDefault()
  //     })
  //   })

  //   document.addEventListener('drop', function (event) {
  //     event.preventDefault()

  //     if (event.target == null) return
  //     const area = (event.target as HTMLElement).dataset.dropArea
  //     if (area != null) {
  //       ref.current!.classList.remove('attached-top', 'attached-bottom')
  //       ref.current!.classList.add(`attached-${area}`)
  //     }

  //     // ref.current!.style.display = 'block'
  //     ref.current!.style.transform = ''
  //     bgRef.current.classList.remove('dragging')
  //   })
  // })

  return (
    <div className="action-bar-background" ref={bgRef}>
      <div className="dropzone-top" data-drop-area="top"></div>
      <div className="dropzone-bottom" data-drop-area="bottom"></div>
      <div className="action-bar attached-top" ref={ref} draggable>
        <div className="primary">
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
              <CombatActionButton
                key={`${intent.action}${i}`}
                adventurer={adventurer}
                location={location}
                intent={intent}
                active={intent.action === activeIntent?.action}
                onClick={() => { selectPrimaryCombatAction(intent) }}
              />
            ))}
            <PotionActionButton
              active={secondary === 'potion'}
              onClick={() => { openSecondaryActionBar('potion') }}
              adventurer={adventurer}
            />
          </div>

          { buttonVisible && (
            <Button size="medium" onClick={doAction} disabled={buttonDisabled}>
              {buttonText}
            </Button>
          )}
          <div className="button-close" onClick={onClose}>x</div>
        </div>
        { secondary === 'potion' && (
          <PotionSecondaryActionBar
            adventurer={adventurer}
            activeIntent={activeIntent}
            onSetActionIntent={onSetActionIntent}
          />
        )}
      </div>

    </div>
  )
}

export default ActionBar
