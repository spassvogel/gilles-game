import { useState } from 'react'
import DebugSpriteDemo from './DebugSpriteDemo'
import { allAnimations, type Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation'
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor'
import { Assets } from 'pixi.js'
import { sprites } from 'bundles/sprites'
import './styles/debugSprites.scss'

const allSpritesheets: Array<keyof typeof sprites> = [
  'SCENE_ACTOR_ELF_BOW',
  'SCENE_ACTOR_KNIGHT_SWORD',
  'SCENE_ACTOR_ORC_AXE',
  'SCENE_ACTOR_SKELETON',
  'SCENE_ACTOR_TROLL_AXE',
  'SCENE_ACTOR_TROLL_SWORD'
]

const allOrientations = [
  Orientation.north,
  Orientation.northEast,
  Orientation.east,
  Orientation.southEast,
  Orientation.south,
  Orientation.southWest,
  Orientation.west,
  Orientation.northWest
]

const DebugSprites = () => {
  const [sprite, setSelectedSprite] = useState<keyof typeof sprites>(allSpritesheets[0])
  const [animation, setAnimation] = useState<Animation>('stand')
  const [orientation, setOrientation] = useState<Orientation>(Orientation.north)
  const [currentFrame, setCurrentFrame] = useState<number>(0)
  const spritesheet = Assets.get(sprites[sprite])

  return (
    <div className="debug-sprites">
      <div>
        <select value={sprite} onChange={(e) => { setSelectedSprite(e.currentTarget.value as keyof typeof sprites) }}>
          {allSpritesheets.map(s => <option key={s} value={s}>{s.substring('SCENE_ACTOR_'.length)}</option>)}
        </select>
        <select value={animation} onChange={(e) => { setAnimation(e.currentTarget.value as Animation) }}>
          {allAnimations.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={orientation} onChange={(e) => { setOrientation(e.currentTarget.value as Orientation) }}>
          {allOrientations.map(o => <option key={o}>{o}</option>)}
        </select>
        <input type="number" value={currentFrame} onChange={(e) => { setCurrentFrame(e.currentTarget.value as unknown as number) }} />
      </div>
        {(spritesheet !== undefined && (
          <DebugSpriteDemo
            spritesheet={spritesheet}
            animation={animation}
            orientation={orientation}
            currentFrame={currentFrame}
          />
        ))}
  </div>
  )
}

export default DebugSprites
