import * as React from "react";
import { getDefinition } from 'definitions/structures';
import { formatDuration } from 'utils/format/time';
import { TavernStructureDefinition } from 'definitions/structures/types';
import Icon from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import "./styles/upgradeHelpModal.scss"

export interface Props  {
    level: number;
}

const UpgradeHelpModal = (props: Props) => {
    const { level } = props;
    const structureDefinition: TavernStructureDefinition = getDefinition("tavern");

    const currentLevel = structureDefinition.levels[level];
    const nextLevel = structureDefinition.levels[level + 1];


    return (
        <div className="tavern-upgrade-help-modal">
            <div className="top">
                <h3>{TextManager.get("ui-structure-help-upgrade-title", { structure: "tavern"} )}</h3>
                <div className="cost">
                    <section>
                        {TextManager.get("ui-structure-help-upgrade-cost-gold", { gold: nextLevel.cost.gold})}
                    </section>
                    { nextLevel.cost.time && <section>{formatDuration(nextLevel.cost.time)}</section> }
                </div>
            </div>
            <div className="rooms-increase">
                <div className="header"/>
                <div className="header">
                    {TextManager.getStructureName("tavern")}
                </div>
                <div className="header number">
                    {TextManager.get("ui-structure-help-upgrade-header-level", {
                        level: level + 1
                    })}
                </div>
                <div className="header"/>
                <div className="header number">
                    {TextManager.get("ui-structure-help-upgrade-header-level", {
                        level: level + 2
                    })}
                </div>
                <div><Icon image="img/ui/structures/tavern.png" size="smallest"/></div>
                <div>{TextManager.get("ui-structure-tavern-rooms")}</div>
                <div className="number">{currentLevel.rooms}</div>
                <div className="arrow">⟶</div>
                <div className="number">{nextLevel.rooms}</div>
            </div>
        </div>
    )
}

export default UpgradeHelpModal;