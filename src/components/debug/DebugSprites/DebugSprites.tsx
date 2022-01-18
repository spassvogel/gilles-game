import { useEffect, useState } from 'react';
import DebugSpriteDemo from './DebugSpriteDemo';
import { loadResourceAsync } from 'utils/pixiJs';
import LoadingSpinner from 'components/ui/loading/LoadingSpinner';
import { allAnimations, Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation';
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor';

const allSpritesheets = ['elf-bow', 'knight-sword', 'orc-axe', 'skeleton', 'troll-axe', 'troll-sword'] as const;
type Spritesheet = typeof allSpritesheets[number];

const getSpritesheetPath = (spritesheet: Spritesheet) => `img/scene/actors/${spritesheet}.json`;
const allOrientations = [
  Orientation.north,
  Orientation.northEast,
  Orientation.east,
  Orientation.southEast,
  Orientation.south,
  Orientation.southWest,
  Orientation.west,
  Orientation.northWest,
];

const DebugSprites = () => {
  const [spritesheet, setSelected] = useState<Spritesheet>('elf-bow');
  const [animation, setAnimation] = useState<Animation>('stand');
  const [orientation, setOrientation] = useState<Orientation>(Orientation.north);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      const spritesheets = allSpritesheets.map(s => getSpritesheetPath(s));
      for (const path of spritesheets) {
        await loadResourceAsync(path);
      }
      setLoaded(true);
    })();
  });

  if (!loaded) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className="debug-sprites">
      <div>
        <select value={spritesheet} onChange={(e) => { setSelected(e.currentTarget.value as Spritesheet); }}>
          {allSpritesheets.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={animation} onChange={(e) => { setAnimation(e.currentTarget.value as Animation); }}>
          {allAnimations.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={orientation} onChange={(e) => { setOrientation(e.currentTarget.value as Orientation); }}>
          {allOrientations.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <DebugSpriteDemo
        spritesheetPath={getSpritesheetPath(spritesheet)}
        animation={animation}
        orientation={orientation}
      />
    </div>
  );
};

export default DebugSprites;
