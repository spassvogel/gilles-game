import * as React from "react";
import { useState } from 'react';
import { Item } from "definitions/items/types";
import { ProductionDefinition } from "definitions/production/types";
import { getDefinition, Structure } from "definitions/structures";
import { getDefinition as getProductionDefinition } from "definitions/production";
import { ProductionStructureDefinition } from "definitions/structures/types";
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from "mechanics/crafting";
import { TextManager } from "global/TextManager";
import { formatDuration } from "utils/format/time";
import Progressbar from "components/ui/common/Progressbar";
import UpDownValue from "components/ui/common/UpDownValue";
import ResourcesCostBox from 'components/ui/resources/ResourcesCostBox';
import { ProductionStructureStoreState } from 'store/types/structure';
import useStructureState from 'hooks/store/useStructureState';
import { useResourcesState } from 'hooks/store/resources';
import useStockpileState from 'hooks/store/useStockpileState';
import { useWorkersFreeState } from 'hooks/store/useWorkersState';
import { useCraftingTasksStateByStructure, useStudyingTasksStateByStructure } from 'hooks/store/useTasksState';
import { removeResources } from 'store/actions/resources';
import { increaseWorkers } from 'store/actions/structures';
import { addItemToWarehouse } from 'store/actions/items';
import { TaskType } from 'store/types/task';
import { startTask } from 'store/actions/tasks';
import { useDispatch } from 'react-redux';
import Button from 'components/ui/buttons/Button';
import ItemsBox from 'components/ui/items/ItemsBox';
import ItemIcon from 'components/ui/items/ItemIcon';
import StructureViewHeader from './StructureViewHeader';
import UpgradeStructureButton from './UpgradeStructureButton';
import { IconSize } from 'components/ui/common/Icon';
import "./styles/productionStructureView.scss";

export interface Props {
    structure: Structure;
}

const ProductionStructureView = (props: Props) => {
    const {structure} = props;
    const [selectedItem, setSelectedItem] = useState<Item>();
    const [workersAssigned, setWorkersAssigned] = useState<number>(0);

    const dispatch = useDispatch();
    const resourcesState = useResourcesState();
    const stockpileState = useStockpileState();
    const workersFree = useWorkersFreeState();
    const craftingTasks = useCraftingTasksStateByStructure(structure);
    const studyingTasks = useStudyingTasksStateByStructure(structure);

    const structureDefinition = getDefinition<ProductionStructureDefinition>(props.structure);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.structure}
            with type ProductionStructureDefinition.`);
    }
    const storeState: ProductionStructureStoreState = useStructureState(structure) as ProductionStructureStoreState;
    const displayName = TextManager.getStructureName(props.structure);

    const handleCraft = (productionDefinition: ProductionDefinition, workers: number) => {
        const craftingTime = calculateProductionTime(productionDefinition.cost.time || 0, workers);
        dispatch(removeResources(productionDefinition.cost.resources || {}));
        dispatch(increaseWorkers(structure, workers));

        const callbacks = [
            addItemToWarehouse(productionDefinition.item),
            increaseWorkers(structure, workers),
        ];
        const start = startTask(TaskType.craftItem,
            productionDefinition.item,
            `${structure}.craft`,
            craftingTime,
            callbacks);
        dispatch(start);
    }

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

    const createCraftingDetails = () => {
        const item = selectedItem;
        if (!item) { return null; }

        const produces = getProductionDefinition(item)!;
        const costResources = produces.cost.resources!;
        const missingAtLeastOneResource = Object.keys(costResources)
            .some((resource) => costResources[resource] > resourcesState[resource]);

        let missingAtLeastOneItem = false;
        const costMaterials = produces.cost.materials;
        if (costMaterials) {
            missingAtLeastOneItem = costMaterials.some((i: Item) => stockpileState.indexOf(i) === -1);
        }

        const disabled = missingAtLeastOneResource || missingAtLeastOneItem || workersAssigned < 1;
        // TODO: [10/07/2019] Perhaps each item can have a number of minimum workers?

        const makeTimeString = (asNumber: number): string => {
            if (workersAssigned === 0) {
                return "";
            }
            const craftingTime = calculateProductionTime(asNumber, workersAssigned);
            const time = formatDuration(craftingTime);
            return TextManager.get("ui-structure-production-crafting-time", { time });
        };

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();

            handleCraft(produces, workersAssigned);
            setWorkersAssigned(0);
        };

        const handleUp = (e: React.MouseEvent) => {
            e.stopPropagation();
            setWorkersAssigned(workersAssigned + 1);
        };

        const handleDown = (e: React.MouseEvent) => {
            e.stopPropagation();
            setWorkersAssigned(workersAssigned - 1);
        };

        return (
            <div className="crafting-details">
                { TextManager.get("ui-structure-production-craft-a", {item}) }
                <div className="crafting-costs">
                    <fieldset>
                        <ResourcesCostBox resources={costResources} />
                    </fieldset>
                    <fieldset>
                        {costMaterials && <ItemsBox items={costMaterials} />}
                    </fieldset>
                </div>
                <div className="buttonrow">
                    <div>
                        <UpDownValue
                            value={workersAssigned}
                            label={TextManager.get("ui-structure-production-workers")}
                            onUp={handleUp}
                            onDown={handleDown}
                            upDisabled={
                                workersAssigned >= workersFree ||
                                workersAssigned >= MAX_WORKERS_CRAFTING
                            }
                            downDisabled={ workersAssigned < 1 }
                        />
                        { makeTimeString(produces.cost.time || 0) }
                    </div>
                    <div>
                        <Button
                            disabled={disabled}
                            className="craft"
                            onClick={handleClick}
                        >
                            {TextManager.get("ui-structure-production-craft")}
                        </Button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        // TODO: abstract some stuff to generic StructureView
        <>
            <StructureViewHeader structure={props.structure} />

            <details open={true } className = "production-structure-view">
                <summary>{displayName}</summary>
                <section>
                    <UpgradeStructureButton structure={structure} />
                    <div>craft:</div>
                    {/* { createCraftRows() } */}
                    <div className="crafting-area">
                        <ul className="vertical-tab-bar">
                            {createCraftTabs()}
                        </ul>
                        {createCraftingDetails()}
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
