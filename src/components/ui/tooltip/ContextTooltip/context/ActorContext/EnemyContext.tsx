import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";
import { getDefinition } from "definitions/enemies";
import { EnemyType } from "definitions/enemies/types";
import { TextManager } from "global/TextManager";

interface Props {
  actorObject: ActorObject
}

const EnemyContext = (props: Props) => {
  const { actorObject } = props;
  const definition = getDefinition(actorObject.name as EnemyType)
  return (
    <div>
      {TextManager.getEnemyName(actorObject.name as EnemyType)}
    </div>
  )
}

export default EnemyContext;
