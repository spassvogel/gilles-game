import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";

interface Props {
  actorObject: ActorObject
}

const AdventurerContext = (props: Props) => {
  const { actorObject } = props;
  const adventurerState = useAdventurerState(actorObject.name);
  return (
    <div>
      {adventurerState.name}
    </div>
  )
}

export default AdventurerContext;
