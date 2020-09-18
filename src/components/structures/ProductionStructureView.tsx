import * as React from "react";
import { useState } from 'react';
import ItemsCostBox from "containers/ui/context/items/ItemsCostBox";
import { Item } from "definitions/items/types";
import { ProductionDefinition } from "definitions/production/types";
import { getDefinition, Structure } from "definitions/structures";
import { getDefinition as getProductionDefinition } from "definitions/production";
import { ProductionStructureDefinition } from "definitions/structures/types";
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from "mechanics/crafting";
import { TextManager } from "global/TextManager";
import { formatDuration } from "utils/time";
import ItemIcon from "../ui/ItemIcon";
import Progressbar from "../ui/Progressbar";
import UpDownValue from "../ui/UpDownValue";
import StructureViewHeader from './StructureViewHeader';
import ResourcesCostBox from 'components/ui/resources/ResourcesCostBox';
import { ProductionStructureStoreState } from 'stores/structure';
import useGoldState from 'hooks/store/useGoldState';
import useStructureState from 'hooks/store/useStructureState';
import useResourcesState from 'hooks/store/useResourcesState';
import useStockpileState from 'hooks/store/useStockpileState';
import { useWorkersFreeState } from 'hooks/store/useWorkersState';
import { useCraftingTasksStateByStructure, useStudyingTasksStateByStructure } from 'hooks/store/useTasksState';
import { removeResources } from 'actions/resources';
import { increaseWorkers, upgradeStructure } from 'actions/structures';
import { addItemToWarehouse } from 'actions/items';
import { TaskType } from 'stores/task';
import { startTask } from 'actions/tasks';
import { useDispatch } from 'react-redux';
import { subtractGold } from 'actions/gold';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';
import "./styles/productionStructureView.scss";

export interface Props {
    structure: Structure;
}

const ProductionStructureView = (props: Props) => {
    const {structure} = props;
    const [selectedItem, setSelectedItem] = useState<Item>();
    const [workersAssigned, setWorkersAssigned] = useState<number>(0);

    const dispatch = useDispatch();
    const gold = useGoldState();
    const structureState = useStructureState(structure) as ProductionStructureStoreState;
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
    const level: number = structureState.level;
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

    const handleUpgrade = (cost: number) => {
        dispatch(subtractGold(cost));
        dispatch(upgradeStructure(structure)); // TODO: [07/07/2019] time to upgarde??

        dispatch(addLogText("log-town-upgrade-structure-complete", {
            level: level + 1,
            structure,
        }, LogChannel.town));
    }

    const createUpgradeRow = () => {
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        return (
            <div>
                <label>{TextManager.get("ui-structure-level")}</label>
                { `${(level + 1)} / ${structureDefinition.levels.length}` }
                <button
                    style={{float: "right"}}
                    onClick={() => {handleUpgrade(nextLevelCost)}}
                    disabled={!canUpgrade}>
                        { upgradeText }
                </button>
            </div>
        );
    };

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
                    <ItemIcon item={item} />
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
                        {costMaterials && <ItemsCostBox items={costMaterials} />}
                    </fieldset>
                </div>
                <div style={{display: "flex"}}>
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
                    &nbsp;
                    { makeTimeString(produces.cost.time || 0) }
                </div>
                <div>
                    <button
                        disabled={disabled }
                        onClick={handleClick }>
                        Craft
                    </button>
                </div>
            </div>
        );
    };


    return (
        // TODO: abstract some stuff to generic StructureView
        <>
            <StructureViewHeader structure={props.structure} />

            <details open={true } className = "productionstructureview">
                <summary>{displayName}</summary>
                <section>
                    { createUpgradeRow() }
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
