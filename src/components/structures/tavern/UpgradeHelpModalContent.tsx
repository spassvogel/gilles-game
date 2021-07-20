import * as React from "react";
import { getDefinition } from 'definitions/structures';
import { TavernStructureDefinition } from 'definitions/structures/types';
import Icon from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import "./styles/upgradeHelpModalContent.scss"

export interface Props  {
    level: number;
}

const UpgradeHelpModalContent = (props: Props) => {
    const { level } = props;
    const structureDefinition: TavernStructureDefinition = getDefinition("tavern");

    const currentLevel = structureDefinition.levels[level];
    const nextLevel = structureDefinition.levels[level + 1];


    return (
        <div className="upgrade-help-model-content-tavern">
            <h3>{TextManager.get("ui-structure-help-upgrade-improvements")}</h3>

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

export default UpgradeHelpModalContent;