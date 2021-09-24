import * as React from "react";
import { TextManager } from 'global/TextManager';
import { ActorObject } from "store/types/scene";
import { Allegiance } from "store/types/combat";
import AdventurerContext from "./AdventurerContext";
import EnemyContext from "./EnemyContext";
import './styles/actorContext.scss';


interface Props {
  actorObject: ActorObject
}


// Shows stuff relevant for combat
const ActorContext = (props: Props) => {
  const { actorObject } = props;
  return (
    <div className="actor-context">
      {actorObject.allegiance === Allegiance.player && (<AdventurerContext actorObject={actorObject} />)}
      {actorObject.allegiance === Allegiance.enemy && (<EnemyContext actorObject={actorObject} />)}
    </div>
  )
}

export default ActorContext;
