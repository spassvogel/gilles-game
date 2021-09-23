import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";

interface Props {
  actorObject: ActorObject
}

const EnemyContext = (props: Props) => {
  const { actorObject } = props;
  return (
    <div>
      {actorObject.name}
    </div>
  )
}

export default EnemyContext;
