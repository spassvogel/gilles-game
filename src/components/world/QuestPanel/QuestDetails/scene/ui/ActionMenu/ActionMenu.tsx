import { useCallback, useContext, useMemo, useRef } from 'react'
import { type Location } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { useAdventurer } from 'hooks/store/adventurers'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type EnemyObject, isEnemy, SceneActionType } from 'store/types/scene'
import { type ActionIntent } from '../SceneUI'
import ActionButton from './ActionButton'
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar'
import EnemyAvatar from 'components/ui/enemy/EnemyAvatar'
import { IconSize } from 'components/ui/common/Icon'
import { WeaponAbility } from 'definitions/abilities/types'
import DiamondFrame from './DiamondFrame'
import useDraggable from 'hooks/store/useDraggable'

import './styles/actionMenu.scss'

type Props = {
  adventurerId: string
  location: Location
  intents: ActionIntent[]
  onClose: () => void
  onSetActionIntent: (intent?: ActionIntent) => void
}

const ActionMenu = (props: Props) => {
  const { adventurerId, location, intents, onClose, onSetActionIntent } = props
  const adventurer: AdventurerStoreState = useAdventurer(adventurerId)
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller')

  const ref = useRef<HTMLDivElement>(null)
  const handle = useRef<HTMLDivElement>(null)
  useDraggable(ref, handle)

  const enemyTargetted = useMemo(() => {
    const [object] = controller?.getObjectsAtLocation(location, isEnemy) ?? []
    return object as EnemyObject
  }, [controller, location])

  const renderButtonText = useCallback((intent: ActionIntent) => {
    switch (intent.action) {
      case SceneActionType.move: {
        return `Move (${intent.apCost} AP)`
      }
      case SceneActionType.melee:
      case SceneActionType.shoot: {
        if (!intent.weaponWithAbility) {
          return undefined
        }
        return (
          <>
            {/* <ItemIcon
              size={IconSize.smallest}
              item={intent.weaponWithAbility.weapon}
            /> */}
            {/* {TextManager.getItemName(intent.weaponWithAbility?.weapon)} */}
            {WeaponAbility[intent.weaponWithAbility.ability]}
            {' '}
            ({intent !== undefined && JSON.stringify(intent?.apCost)}AP)
          </>
        )
      }
    }
  }, [])

  return (
    <div className="action-menu-background" onClick={onClose}>
      <div className="action-menu" ref={ref}>
        <div className="background" ref={handle}>
          <DiamondFrame className="adventurer-frame gold">
            <AdventurerAvatar adventurer={adventurer} size={IconSize.big}/>
          </DiamondFrame>
          {enemyTargetted?.name !== undefined && (
            <DiamondFrame className="enemy-frame gold">
              <EnemyAvatar actorObject={enemyTargetted} size={IconSize.big}/>
            </DiamondFrame>
          )}
        </div>
        <div className="action-button action-button-close" onClick={onClose}>x close</div>

        <ul className="button-list">
          {intents.filter(i => i.isValid).map((intent, i) => (
            <li key={`${intent.action}${i}`}>
              <ActionButton
                adventurer={adventurer}
                location={location}
                intent={intent}
                onSetActionIntent={onSetActionIntent}
                renderText={renderButtonText}
                onCloseMenu={onClose}
              />
            </li>
          ))}
        </ul>
        {/* <div>
          {enemyTargetted?.name && (
            <>
              {TextManager.getEnemyName(enemyTargetted.name)}
              <EnemyAvatar actorObject={enemyTargetted}/>
            </>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default ActionMenu
