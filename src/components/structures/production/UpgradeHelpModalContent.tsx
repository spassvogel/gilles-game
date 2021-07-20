import * as React from "react";
import { getDefinition, Structure } from 'definitions/structures';
import { ProductionStructureDefinition } from 'definitions/structures/types';
import { IconSize } from 'components/ui/common/Icon';
import ItemIcon from 'components/ui/items/ItemIcon';
import { Item } from "definitions/items/types";
import "./styles/upgradeHelpModalContent.scss"

export interface Props  {
    structure: Structure;
    level: number;
}

const UpgradeHelpModalContent = (props: Props) => {
    const { level, structure } = props;
    const structureDefinition: ProductionStructureDefinition = getDefinition(structure);
    const nextLevel = structureDefinition.levels[level + 1];

    const renderRow = (item: Item) => {
        return (
            <ItemIcon key={item} item={item} size={IconSize.small} />
        )
    }

    return (   
        <div className="upgrade-help-model-content-production">
            <h3>Unlocks crafting of these items</h3>
            <div className="unlocks">
                {nextLevel.unlocks.map(item => renderRow(item))}
            </div>
        </div>
    )
}

export default UpgradeHelpModalContent;