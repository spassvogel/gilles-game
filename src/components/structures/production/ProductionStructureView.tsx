import * as React from "react";
import { useState } from 'react';
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import { ProductionStructureDefinition } from "definitions/structures/types";
import { TextManager } from "global/TextManager";
import { formatDuration } from "utils/format/time";
import Progressbar from "components/ui/common/Progressbar";
import { ProductionStructureStoreState } from 'store/types/structure';
import useStructureState from 'hooks/store/useStructureState';
import { useCraftingTasksStateByStructure, useStudyingTasksStateByStructure } from 'hooks/store/useTasksState';
import ItemIcon from 'components/ui/items/ItemIcon';
import StructureViewHeader from '../StructureViewHeader';
import UpgradeStructureButton from '../UpgradeStructureButton';
import { IconSize } from 'components/ui/common/Icon';
import UpgradeHelpModal from './UpgradeHelpModal';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import CraftingDetails from './CraftingDetails';
import "./styles/productionStructureView.scss";

export interface Props {
    structure: Structure;
}

const ProductionStructureView = (props: Props) => {
    const {structure} = props;
    const [selectedItem, setSelectedItem] = useState<Item>();
    const level = useStructureState(structure).level;

    const craftingTasks = useCraftingTasksStateByStructure(structure);
    const studyingTasks = useStudyingTasksStateByStructure(structure);

    const structureDefinition = getDefinition<ProductionStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure}
            with type ProductionStructureDefinition.`);
    }
    const storeState: ProductionStructureStoreState = useStructureState(structure) as ProductionStructureStoreState;
    const displayName = TextManager.getStructureName(props.structure);

    const createCraftTabs = () => {
        return storeState.produces.map((item) => {
            const handleSelectCraftingItem = (e: React.MouseEvent) => {
                e.stopPropagation();

                setSelectedItem(item);
            };

            return (
                <li
                    key={`craft${item}`}
                    onClick={handleSelectCraftingItem}
                    className={selectedItem === item ? "selected" : ""}
                >
                    <ItemIcon item={item} size={IconSize.small} />
                    { TextManager.getItemName(item) }
                </li>
            );
        });
    };

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = <UpgradeHelpModal level={level} structure={structure} />;
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }

    return (
        // TODO: abstract some stuff to generic StructureView
        <>
            <StructureViewHeader structure={props.structure} />
            <details
                open={true}
                className = "production-structure-view"
            >
                <summary>{displayName}</summary>
                <section>
                    <UpgradeStructureButton structure={structure} onHelpClicked={handleHelpClicked}/>
                    <div>craft:</div>
                    <div className="crafting-area">
                        <ul className="vertical-tab-bar">
                            {createCraftTabs()}
                        </ul>
                        { selectedItem && <CraftingDetails item={selectedItem} structure={structure} /> }
                    </div>
                    <fieldset>
                        <legend>{TextManager.get("ui-structure-production-crafting")}</legend>
                        {craftingTasks.map((t) => (
                            <Progressbar
                                key={`${t.name}${t.startTime}`}
                                label={`${t.name} (${formatDuration(t.timeRemaining)})`}
                                progress={t.progress}
                            />
                        ))}
                    </fieldset>
                    {studyingTasks.length > 0 && (
                    <fieldset>
                        <legend>{TextManager.get("ui-structure-production-studying")}</legend>
                        {studyingTasks.map((t) => (
                            <Progressbar
                                key={`${t.name}${t.startTime}`}
                                label={`${t.name} (${formatDuration(t.timeRemaining)})`}
                                progress={t.progress}
                            />
                        ))}
                    </fieldset>
                    )}
                </section>
            </details>
        </>
    );
}

export default ProductionStructureView;
