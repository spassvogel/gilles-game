import React, { useContext } from 'react';
import { SceneControllerContext } from 'components/world/QuestPanel/context/SceneControllerContext';
import { ActorObject } from "store/types/scene";
import "./styles/actorThingy.scss"
import { useAdventurerState } from 'hooks/store/adventurers';

// Sorry for this stupid name.
export interface Props {
  actor: ActorObject;
  
  // onMouseDown?: (location: [number, number]) => void;
}

const ActorThingy = (props: Props) => {
  const { actor } = props;
  const { location = [0, 0] } = actor;
  const controller = useContext(SceneControllerContext)!;
  const adventurer = useAdventurerState(actor.name!);
  const {tileWidth, tileHeight} = controller.getTileDimensions();
  // const transform = `translate(${tileWidth * location[0]}px, ${tileHeight * location[1]}px)`;
  return (
    <div 
      className="actor-thingy"
      style={{
        left: `${location[0] * tileWidth}px`, 
        top: `${location[1] * tileHeight}px`,
        width: `${tileWidth}px`
      }}>
      <div className="name">
        {adventurer?.name}
      </div>
      <div 
        className="healthbar" 
        style={{
          width: `${tileWidth}px`, 
        }}
      >
        <div 
          className="track" 
          style={{ 
            width: `${actor.health}%`
          }}
        />
      </div>
    </div>
  )
}

export default ActorThingy;
