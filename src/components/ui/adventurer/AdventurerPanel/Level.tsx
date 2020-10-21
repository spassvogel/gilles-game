import * as React from "react";
import { levelToXp, xpToLevel } from 'mechanics/adventurers/levels';
import Progressbar from 'components/ui/common/Progressbar';
import { TextManager } from 'global/TextManager';

export interface Props {
    xp: number;
}

const Level = (props: Props) => {
    const { xp } = props;
    const currentLevel = xpToLevel(xp);
    const currentLevelXp = levelToXp(currentLevel); // start
    const nextLevel = currentLevel + 1;
    const nextLevelXp = levelToXp(nextLevel);

    return (
        <div className="level">
            Level {currentLevel}
            <Progressbar
                progress={(xp - currentLevelXp) / (nextLevelXp - currentLevelXp)}
                label={TextManager.get("ui-adventurer-info-xp-progress", {
                    xp: Math.floor(xp - currentLevelXp),
                    next: nextLevelXp - currentLevelXp
                })}
            />
        </div>
    )
}
export default Level;

