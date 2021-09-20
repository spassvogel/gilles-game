import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import React, { useContext, useMemo, useState } from 'react';
import { SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import { ActionIntent } from '../SceneUI';
import Segment from './Segment';
import "./styles/combatUIWidget.scss";

interface Props {
  location: [number, number];
  selectedActorId: string;
  actionIntent?: ActionIntent;
  onActionChange: (action?: SceneActionType) => void;
}

// CombatUIWidget shows a circle
const CombatUIWidget = (props: Props) => {
  const {location, actionIntent, onActionChange,selectedActorId} = props;
  const controller = useContext(SceneControllerContext);
  if (!controller) throw Error("No scene controller");
  const {tileWidth, tileHeight} = controller.getTileDimensions();
  const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;
  const [collapsed, setCollapsed] = useState(true);

  const actorLocation = useMemo(() => {
    return controller.getSceneActor(selectedActorId)?.location;
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleMouseOver = () => {
    if (!locationEquals(location, actorLocation ?? [0, 0])){
      // cant expand the widget when on the current location of the actor
      setCollapsed(false);
    }
  }

  const handleMouseOut = () => {
    setCollapsed(true); // todo enable
  }

  const handleSegmentActivate = (action: SceneActionType) => {
    onActionChange(action);

    // const ap = controller.calculateWalkApCosts(location, location);
  }

  const handleSegmentDeactivate = (_action: SceneActionType) => {
    onActionChange(undefined);
    // setText("") // todo enable
  }


  return (
    <div
      className={`combat-ui-widget ${collapsed ? "collapsed" : "expanded"}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Segment
        position="w"
        tileHeight={tileHeight}
        icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/knife-thrust.svg`}
        onActivate={() => handleSegmentActivate(SceneActionType.slash)}
        onDeactivate={() => handleSegmentDeactivate(SceneActionType.slash)}
        activated={actionIntent?.action === SceneActionType.slash}
      />
      <Segment
        position="sw"
        tileHeight={tileHeight}
        icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/high-shot.svg`}
        onActivate={() => handleSegmentActivate(SceneActionType.rangedAttack)}
        onDeactivate={() => handleSegmentDeactivate(SceneActionType.rangedAttack)}
        activated={actionIntent?.action === SceneActionType.rangedAttack}
      />
      <Segment
        position="s"
        tileHeight={tileHeight}
        icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/walking-boot.svg`}
        onActivate={() => handleSegmentActivate(SceneActionType.move)}
        onDeactivate={() => handleSegmentDeactivate(SceneActionType.move)}
        activated={actionIntent?.action === SceneActionType.move}
      />
      <Segment
        position="se"
        icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/sunken-eye.svg`}
        tileHeight={tileHeight}
        activated={false}
      />
      <Segment
        position="e"
        icon={`${process.env.PUBLIC_URL}/img/scene/ui/combat/icons/crosshair.svg`}
        tileHeight={tileHeight}
        activated={false}
      />
      <div className="info" style={{ width: tileWidth }}>
        {getText(actionIntent)}
      </div>
    </div>
  )
}

export default CombatUIWidget;

const getText = (actionIntent?: ActionIntent) => {
  if (!actionIntent) return null;
  if (actionIntent.action === SceneActionType.move) {
    if (!actionIntent.path?.length) {
      // no path possible
      return null;
    }
    const insufficient = (actionIntent.actorAP || 0) < (actionIntent.apCost || 0);
    return (
      <>
      <span>
        Move
      </span>
      <span className={`${(insufficient) ? "insufficient": ""}`}>
        {` ${actionIntent.apCost}`}AP
      </span>
      </>
    );
  }
  if (actionIntent.action === SceneActionType.slash) {
    if (!actionIntent.path?.length) {
      // no path possible
      return null;
    }
    const insufficient = (actionIntent.actorAP || 0) < (actionIntent.apCost || 0);
    return (
      <>
      <span>
        Slash
      </span>
      <span className={`${(insufficient) ? "insufficient": ""}`}>
        {` ${actionIntent.apCost}`}AP
      </span>
      </>
    );
  }
  if (actionIntent.action === SceneActionType.rangedAttack) {
    // todo: check range!
    const insufficient = (actionIntent.actorAP || 0) < (actionIntent.apCost || 0);
    return (
      <>
      <span>
        Ranged atk
      </span>
      <span className={`${(insufficient) ? "insufficient": ""}`}>
        {` ${actionIntent.apCost}`}AP
      </span>
      </>
    );
  }
  return "?";
}

