import * as React from "react";
import { getDefinition, Structure } from 'definitions/structures';
import { formatDuration } from 'utils/format/time';
import { ProductionStructureDefinition } from 'definitions/structures/types';
import { IconSize } from 'components/ui/common/Icon';
import { TextManager } from 'global/TextManager';
import ItemIcon from 'components/ui/items/ItemIcon';
import { Item } from "definitions/items/types";
import "./styles/upgradeHelpModal.scss"

export interface Props  {
    structure: Structure;
    level: number;
}

const UpgradeHelpModal = (props: Props) => {
    const { level, structure } = props;
    const structureDefinition: ProductionStructureDefinition = getDefinition(structure);
    const nextLevel = structureDefinition.levels[level + 1];

    const renderRow = (item: Item) => {
        return (
            <ItemIcon key={item} item={item} size={IconSize.small} />
        )
    }

    return (
        <div className="production-upgrade-help-modal">
            <div className="top">
                <h3>{TextManager.get("ui-structure-help-upgrade-title", { structure } )}</h3>
                <div className="cost">
                    <section>
                        {TextManager.get("ui-structure-help-upgrade-cost-gold", { gold: nextLevel.cost.gold})}
                    </section>
                    { nextLevel.cost.time && <section>{formatDuration(nextLevel.cost.time)}</section> }
                </div>
            </div>
            <div className="unlocks">
                {nextLevel.unlocks.map(item => renderRow(item))}
            </div>
        </div>
    )
}

export default UpgradeHelpModal;