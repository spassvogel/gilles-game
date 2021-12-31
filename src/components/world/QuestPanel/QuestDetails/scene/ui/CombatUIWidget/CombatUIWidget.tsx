import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { useContext } from 'react';
import { isEnemy } from 'store/types/scene';
import "./styles/combatUIWidget.scss";

interface Props {
  location: [number, number];
  selectedActorId: string;
}

// CombatUIWidget shows a circle
const CombatUIWidget = (props: Props) => {
  const {location } = props;
  const controller = useContext(SceneControllerContext);
  if (!controller) throw Error("No scene controller");
  const {tileWidth, tileHeight} = controller.getTileDimensions();
  const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;

  const onEnemy = !!controller?.getObjectAtLocation(location, isEnemy);

  const classNames = [
    "combat-ui-widget",
    ...(onEnemy ? ["on-enemy"]: []),
  ]

  return (
    <div
      className={classNames.join(" ")}
      style={{ transform }}
    >
    </div>
  )
}

export default CombatUIWidget;


