import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { Location } from 'utils/tilemap';
import { useContext } from 'react';
import { isEnemy } from 'store/types/scene';
import { ActionIntent } from '../SceneUI';
import './styles/combatUIWidget.scss';

interface Props {
  location: Location;
  selectedActorId: string;
  intents: ActionIntent[];
}

// CombatUIWidget shows a circle
const CombatUIWidget = (props: Props) => {
  const { location, intents } = props;
  const controller = useContext(SceneControllerContext);
  if (!controller) throw Error('No scene controller');
  const { tileWidth, tileHeight } = controller.getTileDimensions();
  const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;

  const onEnemy = (controller?.getObjectsAtLocation(location, isEnemy) ?? []).length > 1;

  const invalid = intents.every(i => !i.isValid);

  const classNames = [
    'combat-ui-widget',
    ...(invalid ? ['invalid'] : []),
    ...(onEnemy ? ['on-enemy'] : []),
  ];

  return (
    <div
      className={classNames.join(' ')}
      style={{ transform }}
    >
    </div>
  );
};

export default CombatUIWidget;


