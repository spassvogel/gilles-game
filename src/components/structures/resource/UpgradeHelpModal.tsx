import * as React from "react";
import { getDefinition, Structure } from 'definitions/structures';
import { formatDuration } from 'utils/format/time';
import resourceDescriptions from "definitions/resources";
import { ResourceStructureDefinition } from 'definitions/structures/types';
import { Resource } from 'definitions/resources';
import Icon from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import "./styles/upgradeHelpModal.scss"

export interface Props  {
    structure: Structure;
    level: number;
}

const UpgradeHelpModal = (props: Props) => {
    const { level, structure } = props;
    const structureDefinition: ResourceStructureDefinition = getDefinition(structure);

    const currentLevel = structureDefinition.levels[level];
    const nextLevel = structureDefinition.levels[level + 1];

    const renderRow = (resource: Resource) => {
        const resourceDescription = resourceDescriptions[resource];

        return (
            <React.Fragment key={resource}>
                <div><Icon image={resourceDescription.iconImg} size="smallest"/></div>
                <div>{TextManager.getResourceName(resource)}</div>
                <div className="number">{currentLevel.generates[resource]}</div>
                <div className="arrow">⟶</div>
                <div className="number">{nextLevel.generates[resource]}</div>
            </React.Fragment>
        )
    }

    return (
        <div className="resource-upgrade-help-modal">
            <div className="top">
                <h3>{TextManager.get("ui-structure-help-upgrade-title", { structure } )}</h3>
                <div className="cost">
                    <section>
                        {TextManager.get("ui-structure-help-upgrade-cost-gold", { gold: nextLevel.cost.gold})}
                    </section>
                    { nextLevel.cost.time && <section>{formatDuration(nextLevel.cost.time)}</section> }
                </div>
            </div>
            <div className="generates-increase">
                <div className="header"/>
                <div className="header">
                    {TextManager.get("ui-structure-resource-help-upgrade-header-generates")}
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
                {Object.keys(nextLevel.generates).map(res => renderRow(Resource[res]))}
            </div>
        </div>
    )
}

export default UpgradeHelpModal;