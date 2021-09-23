import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";
import Attributes from "components/ui/adventurer/AdventurerPanel/Attributes";

interface Props {
  actorObject: ActorObject
}

const AdventurerContext = (props: Props) => {
  const { actorObject } = props;
  const adventurerState = useAdventurerState(actorObject.name);
  return (
    <div>
      {adventurerState.name}
      <Attributes adventurerId={adventurerState.id}/>

    </div>
  )
}

export default AdventurerContext;
