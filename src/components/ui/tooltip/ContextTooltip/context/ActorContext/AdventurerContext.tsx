import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";
import Attributes from "components/ui/adventurer/AdventurerPanel/Attributes";
import { calculateInitialAP } from "mechanics/combat";
import { xpToLevel } from "mechanics/adventurers/levels";

interface Props {
  actorObject: ActorObject
}

const AdventurerContext = (props: Props) => {
  const { actorObject } = props;
  const { name, id, xp, basicAttributes } = useAdventurerState(actorObject.name);
  const level = xpToLevel(xp);
  return (
    <div>
      {name}
      <Attributes adventurerId={id}/>
      AP each turn: {calculateInitialAP(basicAttributes, level)}
    </div>
  )
}

export default AdventurerContext;
