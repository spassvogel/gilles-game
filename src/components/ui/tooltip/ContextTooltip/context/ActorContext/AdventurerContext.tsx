import * as React from "react";
import { useAdventurerState } from "hooks/store/adventurers";
import { ActorObject } from "store/types/scene";
import Attributes from "components/ui/adventurer/AdventurerPanel/Attributes";
import { xpToLevel } from "mechanics/adventurers/levels";
import { TextManager } from "global/TextManager";
import CombatAttributes from "./CombatAttributes";
import { useMemo } from "react";
import { calculateEffectiveAttributesExtended } from "mechanics/adventurers/attributes";

interface Props {
  actorObject: ActorObject
}

const AdventurerContext = (props: Props) => {
  const { actorObject } = props;
  const adventurer = useAdventurerState(actorObject.name);
  const { name, xp, basicAttributes } = adventurer;
  const level = xpToLevel(xp);
  const extendedAttributes = useMemo(() => calculateEffectiveAttributesExtended(adventurer), [adventurer]);

  return (
    <div>
      <div className="name-and-level">
        <div className="name">
          {name}
        </div>
        <div className="level">
          {TextManager.get("ui-tooltip-actor-level", { level })}
        </div>
      </div>
      <Attributes attributes={extendedAttributes} small />
      <CombatAttributes basicAttributes={basicAttributes} level={level} />
    </div>
  )
}

export default AdventurerContext;
