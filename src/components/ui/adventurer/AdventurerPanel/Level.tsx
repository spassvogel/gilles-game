import { levelToXp, MAX_XP, xpToLevel } from 'mechanics/adventurers/levels'
import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar'
import * as TextManager from 'global/TextManager'
import { useEffect, useMemo, useState } from 'react'
import usePrevious from 'hooks/usePrevious'
import { useAdventurer } from 'hooks/store/adventurers'
import { SoundManager } from 'global/SoundManager'

import './styles/level.scss'

export type Props = {
  adventurerId: string
}

const Level = (props: Props) => {
  const { adventurerId } = props
  const { xp, race } = useAdventurer(adventurerId)
  const currentLevel = xpToLevel(xp)
  const currentLevelXp = levelToXp(currentLevel) // start
  const nextLevel = currentLevel + 1
  const nextLevelXp = levelToXp(nextLevel)
  const [dingAnimationRunning, setDingAnimationRunning] = useState(false)

  const lastState = usePrevious({ currentLevel, currentLevelXp, nextLevel, nextLevelXp })
  const lastAdventurer = usePrevious(adventurerId)

  useEffect(() => {
    if (lastAdventurer !== adventurerId) {
      setDingAnimationRunning(false)
    } else if (nextLevel > (lastState?.nextLevel ?? 0)) {
      void SoundManager.playSound('UI_LEVEL_UP')
      setDingAnimationRunning(true)

      setTimeout(() => {
        setDingAnimationRunning(false)
      }, 2000)
    }
  }, [adventurerId, lastAdventurer, lastState?.nextLevel, nextLevel])

  const lastDingAnimationRunning = usePrevious(dingAnimationRunning)

  const progress = useMemo(() => {
    return dingAnimationRunning ? 1 : (xp - currentLevelXp) / (nextLevelXp - currentLevelXp)
  }, [currentLevelXp, dingAnimationRunning, nextLevelXp, xp])

  const label = useMemo(() => {
    if (dingAnimationRunning) {
      return TextManager.get('ui-adventurer-info-xp-level-up')
    }
    if (xp >= MAX_XP) {
      return TextManager.get('ui-adventurer-info-xp-level-max')
    }
    return TextManager.get('ui-adventurer-info-xp-progress', {
      xp: Math.floor(xp - currentLevelXp),
      next: nextLevelXp - currentLevelXp
    })
  }, [dingAnimationRunning, xp, currentLevelXp, nextLevelXp])

  return (
    <div className="level">
      <div className="text">
        <div className="race">
          {TextManager.getRace(race)}
        </div>
        <div className="current-level">
          {TextManager.get('ui-adventurer-info-level', { level: currentLevel })}
        </div>
      </div>
      <PlainProgressbar
        progress={progress}
        animationTime={lastAdventurer === adventurerId && !lastDingAnimationRunning ? 300 : 0}
        label={label}
      />
    </div>
  )
}
export default Level
