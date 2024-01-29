import { useContext } from 'react'
import { type Location } from 'utils/tilemap'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext'
import { type ActionIntent } from '../SceneUI'
import { SceneActionType } from 'store/types/scene'
import Icon, { IconSize } from 'components/ui/common/Icon'
import { getDefinition as getWeaponDefinition } from 'definitions/items/weapons'

type Props = {
  adventurer: AdventurerStoreState
  location: Location
  intent: ActionIntent
  onSetActionIntent: (intent?: ActionIntent) => void
  active?: boolean
}

const ActionButton = (props: Props) => {
  const {
    intent,
    onSetActionIntent,
    active = false
  } = props
  const controller = useContext(SceneControllerContext)
  if (controller == null) throw new Error('No controller')

  const renderIcon = () => {
    switch (intent.action) {
      case SceneActionType.move: {
        return (
          <img className="action-icon" src="/img/ui/icons/walking-boot.svg"></img>
        )
      }
      case SceneActionType.shoot:
      case SceneActionType.melee: {
        const weaponDef = getWeaponDefinition(intent.weaponWithAbility.weapon.type)
        return (
          <Icon
            size={IconSize.small}
            image={weaponDef.iconImg}
          />
        )
      }
    }
  }

  return (
    <div
      className={`action-button ${active ? 'active' : ''}`}
      onClick={() => { onSetActionIntent(intent) }}
    >
      {renderIcon()}
    </div>
  )
}

export default ActionButton
