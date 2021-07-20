import * as React from "react";
import { getDefinition, Structure } from 'definitions/structures';
import { formatDuration } from 'utils/format/time';
import resourceDescriptions from "definitions/resources";
import { WarehouseStructureDefinition } from 'definitions/structures/types';
import { Resource } from 'definitions/resources';
import Icon from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import "./styles/upgradeHelpModalContent.scss"

export interface Props  {
    level: number;
}

const UpgradeHelpModalContent = (props: Props) => {
    const { level } = props;
    const structureDefinition: WarehouseStructureDefinition = getDefinition("warehouse");

    const currentLevel = structureDefinition.levels[level];
    const nextLevel = structureDefinition.levels[level + 1];

    const renderRow = (resource: Resource) => {
        const resourceDescription = resourceDescriptions[resource];

        return (
            <React.Fragment key={resource}>
                <div><Icon image={resourceDescription.iconImg} size="smallest"/></div>
                <div>{TextManager.getResourceName(resource)}</div>
                <div className="number">{currentLevel.maxResources[resource]}</div>
                <div className="arrow">⟶</div>
                <div className="number">{nextLevel.maxResources[resource]}</div>
            </React.Fragment>
        )
    }

    return (
        <div className="upgrade-help-model-content-warehouse">
            <h3>{TextManager.get("ui-structure-help-upgrade-improvements")}</h3>
            <div className="storage-increase">
                <div className="header"/>
                <div className="header">
                    {TextManager.get("ui-structure-warehouse-help-upgrade-header-capacity")}
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
                {Object.keys(nextLevel.maxResources).map(res => renderRow(res as Resource))}
            </div>
        </div>
    )
}

export default UpgradeHelpModalContent;