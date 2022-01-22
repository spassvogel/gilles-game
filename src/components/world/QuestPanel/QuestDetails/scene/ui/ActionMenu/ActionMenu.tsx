import { useCallback, useContext, useMemo } from 'react';
import { Location } from 'utils/tilemap';
import { AdventurerStoreState } from 'store/types/adventurer';
import { DraggableInfoWindow } from 'components/ui/modals/InfoWindow/DraggableInfoWindow';
import { useAdventurerState } from 'hooks/store/adventurers';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { TextManager } from 'global/TextManager';
import { ActorObject, isEnemy, SceneActionType } from 'store/types/scene';
import { ActionIntent } from '../SceneUI';
import ActionButton from './ActionButton';
import AdventurerAvatar from 'components/ui/adventurer/AdventurerAvatar';
import EnemyAvatar from 'components/ui/enemy/EnemyAvatar';
import ItemIcon from 'components/ui/items/ItemIcon';
import { IconSize } from 'components/ui/common/Icon';
import { WeaponAbility } from 'mechanics/weapons';
import './styles/actionMenu.scss';

type Props = {
  adventurerId: string;
  location: Location;
  intents: ActionIntent[];
  onClose: () => void;
  onSetActionIntent: (intent?: ActionIntent) => void;
};

const ActionMenu = (props: Props) => {
  const { adventurerId, location, intents, onClose, onSetActionIntent } = props;
  const adventurer: AdventurerStoreState = useAdventurerState(adventurerId);
  const controller = useContext(SceneControllerContext);
  if (!controller) throw new Error('No controller');

  const enemyTargetted = useMemo(() => {
    return controller?.getObjectAtLocation(location, isEnemy) as ActorObject;
  }, [controller, location]);


  const renderButtonText = useCallback((intent: ActionIntent) => {
    switch (intent.action) {
      case SceneActionType.move: {
        return `Move ${intent.apCost} AP`;
      }
      case SceneActionType.melee:
      case SceneActionType.shoot: {
        if (!intent.weaponWithAbility) {
          return undefined;
        }
        return (
          <>
            <ItemIcon
              size={IconSize.smallest}
              item={intent.weaponWithAbility.weapon}
            />
            {TextManager.getItemName(intent.weaponWithAbility?.weapon)}
                    -
            {WeaponAbility[intent.weaponWithAbility.ability]}
            {intent &&
              JSON.stringify(intent?.apCost)
            }
          </>
        );
      }
    }
  }, []);

  return (
    <div className="action-menu">
      <DraggableInfoWindow className="debug-adventurer-edit action-menu-modal" title="Action" onClose={onClose}>
        {adventurer.name}
        <AdventurerAvatar adventurer={adventurer} />
        <ul>
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
        <div>
          {enemyTargetted?.name && (
            <>
              {TextManager.getEnemyName(enemyTargetted.name)}
              <EnemyAvatar actorObject={enemyTargetted}/>
            </>
          )}
        </div>
      </DraggableInfoWindow>
    </div>
  );
};

export default ActionMenu;

