import * as React from "react";
import { TextManager } from 'global/TextManager';
import { PropsWithChildren } from "react";
import { getDefinition, Structure } from "definitions/structures";
import "./styles/upgradeHelpModal.scss"
import ResourcesCost from "./production/ResourcesCost";
import { ResourceStructureDefinition } from "definitions/structures/types";

export interface Props  {
    structure: Structure;
    level: number;
}

const UpgradeHelpModal = (props: PropsWithChildren<Props>) => {
    const { structure, level, children } = props;
    const structureDefinition: ResourceStructureDefinition = getDefinition(structure);
    const nextLevel = structureDefinition.levels[level + 1];
    return (
        <div className="structure-upgrade-help-modal">
            <div className="top">
                <h3>{TextManager.get("ui-structure-help-upgrade-title", { structure } )}</h3>
                <div className="level">
                    {TextManager.get("ui-structure-help-upgrade-header-level", {
                        level: level + 2
                    })}
                </div>
            </div>
            <div className="cost">
                <h3>Costs</h3>
                { nextLevel.cost.resources && <ResourcesCost resources={nextLevel.cost.resources} gold={nextLevel.cost.gold} className="wrap" /> }
            </div>
            {children}
        </div>
    )
}

export default UpgradeHelpModal;