import * as React from "react";
import { ActorObject } from "store/types/scene";
import { getDefinition } from "definitions/enemies";
import { EnemyType } from "definitions/enemies/types";
import { TextManager } from "global/TextManager";
import Attributes from "components/ui/adventurer/AdventurerPanel/Attributes";
import { calculateDodge, calculateInitialAP } from "mechanics/combat";
import CombatAttributes from "./CombatAttributes";

interface Props {
  actorObject: ActorObject
}

const EnemyContext = (props: Props) => {
  const { actorObject } = props;
  const definition = getDefinition(actorObject.name as EnemyType)
  const level = actorObject.level ?? 1
  return (
    <div>
      <div className="name-and-level">
        <div className="name">
          {TextManager.getEnemyName(actorObject.name as EnemyType)}
        </div>
        <div className="level">
          {TextManager.get("ui-tooltip-actor-level", { level })}
        </div>
      </div>
      <Attributes basicAttributes={definition.attributes} small />
      <CombatAttributes basicAttributes={definition.attributes} level={level} />
    </div>
  )
}

export default EnemyContext;
