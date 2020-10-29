import * as React from "react";
import { Item } from "definitions/items/types";
import { getDefinition, Structure } from "definitions/structures";
import { ProductionStructureDefinition } from "definitions/structures/types";
import { TextManager } from "global/TextManager";
import { formatDuration } from "utils/format/time";
import Progressbar from "components/ui/common/Progressbar";
import useStructureState from 'hooks/store/useStructureState';
import { useCraftingTasksStateByStructure, useStudyingTasksStateByStructure } from 'hooks/store/useTasksState';
import StructureViewHeader from '../StructureViewHeader';
import StructureLevel from '../StructureLevel';
import UpgradeHelpModal from './UpgradeHelpModal';
import { TooltipManager } from 'global/TooltipManager';
import { ContextType } from 'constants/context';
import CraftingArea from './CraftingArea';
import "./styles/productionStructureView.scss";
import { addItemToToProduces } from 'store/actions/structures';

export interface Props {
    structure: Structure;
}

const ProductionStructureView = (props: Props) => {
    const {structure} = props;
    const level = useStructureState(structure).level;

    const craftingTasks = useCraftingTasksStateByStructure(structure);
    const studyingTasks = useStudyingTasksStateByStructure(structure);

    const structureDefinition = getDefinition<ProductionStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure}
            with type ProductionStructureDefinition.`);
    }
    const displayName = TextManager.getStructureName(props.structure);

    const handleHelpClicked = (event: React.MouseEvent) => {
        const origin = (event.currentTarget as HTMLElement);
        const originRect = origin.getBoundingClientRect();
        const content = <UpgradeHelpModal level={level} structure={structure} />;
        TooltipManager.showContextTooltip(ContextType.component, content, originRect, "upgrade-structure-tooltip");

        event.stopPropagation();
    }

    const handleAddUpgradeCallbacks = (nextLevel: number) => {
        const nextLevelDefinition = structureDefinition.levels[nextLevel];
        return nextLevelDefinition.unlocks.map(item => addItemToToProduces(structure, item));
    }

    return (
        // TODO: abstract some stuff to generic StructureView
        <>
            <StructureViewHeader structure={props.structure} />
            <div className = "production-structure-view">
                <section>
                    <StructureLevel
                        structure={structure}
                        onHelpClicked={handleHelpClicked}
                        addUpgradeCallbacks={handleAddUpgradeCallbacks}
                    />
                    <CraftingArea structure={structure} />
                    <fieldset>
                        <legend>{TextManager.get("ui-structure-production-crafting")}</legend>
                        {craftingTasks.map((t) => (
                            <Progressbar
                                key={`${t.name}${t.startTime}`}
                                label={`${TextManager.getItemName(Item[t.name])} (${formatDuration(t.timeRemaining)})`}
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
                                label={`${TextManager.getItemName(Item[t.name])} (${formatDuration(t.timeRemaining)})`}
                                progress={t.progress}
                            />
                        ))}
                    </fieldset>
                    )}
                </section>
            </div>
        </>
    );
}

export default ProductionStructureView;
