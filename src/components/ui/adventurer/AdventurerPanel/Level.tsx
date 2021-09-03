import * as React from "react";
import { levelToXp, xpToLevel } from 'mechanics/adventurers/levels';
import PlainProgressbar from 'components/ui/common/progress/PlainProgressbar';
import { TextManager } from 'global/TextManager';
import { useEffect, useMemo, useState } from "react";
import usePrevious from "hooks/usePrevious";
import { useAdventurerState } from "hooks/store/adventurers";
import { SoundManager } from "global/SoundManager";

export interface Props {
    adventurerId: string;
}

const Level = (props: Props) => {
    const { adventurerId } = props;
    const { xp } = useAdventurerState(adventurerId);
    const currentLevel = xpToLevel(xp);
    const currentLevelXp = levelToXp(currentLevel); // start
    const nextLevel = currentLevel + 1;
    const nextLevelXp = levelToXp(nextLevel);
    const [dingAnimationRunning, setDingAnimationRunning] = useState(false)

    const lastState = usePrevious({ currentLevel, currentLevelXp, nextLevel, nextLevelXp })
    const lastAdventurer = usePrevious(adventurerId);

    useEffect(() => {
        if (lastAdventurer !== adventurerId) {
            setDingAnimationRunning(false)
        }
        else if (nextLevel > (lastState?.nextLevel ?? 0)) {
            SoundManager.playSound("ui/levelUp");
            setDingAnimationRunning(true);

            setTimeout(() => {
                setDingAnimationRunning(false)
            }, 2000)
        }
    }, [adventurerId, lastAdventurer, lastState?.nextLevel, nextLevel])

    const lastDingAnimationRunning = usePrevious(dingAnimationRunning);

    const progress = useMemo(() => {
        return dingAnimationRunning ? 1 : (xp - currentLevelXp) / (nextLevelXp - currentLevelXp)
    }, [currentLevelXp, dingAnimationRunning, nextLevelXp, xp]);

    return (
        <div className="level">
            Level {currentLevel}
            <PlainProgressbar
                progress={progress}
                animationTime={lastAdventurer === adventurerId && !lastDingAnimationRunning ? 300 : 0}
                label={dingAnimationRunning ?  TextManager.get("ui-adventurer-info-xp-level-up") : TextManager.get("ui-adventurer-info-xp-progress", {
                    xp: Math.floor(xp - currentLevelXp),
                    next: nextLevelXp - currentLevelXp
                })}
            />
        </div>
    )
}
export default Level;
