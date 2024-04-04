import { useState } from 'react'
import DebugSpriteDemo from './DebugSpriteDemo'
import { allAnimations, type Animation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/useAnimation'
import { Orientation } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor'
import { Assets } from 'pixi.js'
import { sprites } from 'bundles/sprites'
import { SPRITE_WIDTH } from 'components/world/QuestPanel/QuestDetails/scene/SceneActor/utils'
import { entries } from 'utils/typescript'
import { defineAssetPath } from 'utils/assets'

import './styles/debugSprites.scss'

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

const allSpritesheets = entries(sprites.actors).map(([k]) => k)

const DebugSprites = () => {
  const [name, setName] = useState<keyof typeof sprites.actors>(allSpritesheets[0])
  const [animation, setAnimation] = useState<Animation>('stand')
  const [orientation, setOrientation] = useState<Orientation>(Orientation.north)
  const [currentFrame, setCurrentFrame] = useState<number>(0)
  const spritesheet = Assets.get(defineAssetPath(sprites.actors[name]))
  const [bgColor, setBgColor] = useState<string>('#000000')

  return (
    <div className="debug-sprites" style={{ width: SPRITE_WIDTH * 2 }}>
      <div>
        <select value={name} onChange={(e) => { setName(e.currentTarget.value as keyof typeof sprites.actors) }}>
          {allSpritesheets.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={animation} onChange={(e) => { setAnimation(e.currentTarget.value as Animation) }}>
          {allAnimations.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={orientation} onChange={(e) => { setOrientation(e.currentTarget.value as Orientation) }}>
          {allOrientations.map(o => <option key={o}>{o}</option>)}
        </select>
        <input
          className="current-frame"
          type="number"
          value={currentFrame}
          onChange={(e) => { setCurrentFrame(e.currentTarget.value as unknown as number) }}
          min={0}
        />
      </div>
        {(spritesheet !== undefined && (
          <DebugSpriteDemo
            spritesheet={spritesheet}
            animation={animation}
            orientation={orientation}
            currentFrame={currentFrame}
            bgColor={bgColor}
          />
        ))}
      <div>
        <label >Background color</label>
        <input type="color" className="bg-color" value={bgColor} onChange={(e) => { setBgColor(e.currentTarget.value) }}></input>
      </div>
    </div>
  )
}

export default DebugSprites
