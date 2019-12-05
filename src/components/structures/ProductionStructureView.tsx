import MaterialsCostBox from "containers/ui/context/items/ItemsCostBox";
import ResourcesCostBox from "containers/ui/resources/ResourcesCostBox";
import itemDefinitions from "definitions/items";
import { Item, ItemDefinition } from "definitions/items/types";
import { ProductionDefinition } from "definitions/production/types";
import { getDefinition, Structure } from "definitions/structures";
import { ProductionStructureDefinition, ProductionStructureLevelDefinition } from "definitions/structures/types";
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from "mechanics/crafting";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { TaskStoreState } from "stores/task";
import { TextManager } from "utils/textManager";
import { formatDuration } from "utils/time";
import ItemIcon from "../ui/ItemIcon";
import Progressbar from "../ui/Progressbar";
import UpDownValue from "../ui/UpDownValue";
import "./css/productionstructureview.css";
import { useState } from 'react';

export interface DispatchProps {
    onUpgrade?: (cost: number, level: number) => void;
    onCraft?: (productionDefinition: ProductionDefinition, workers: number) => void;
}

export interface StateProps {
    resources: ResourceStoreState;
    items: Array<Item | null>;  // items in inventory
    level: number;
    workersFree: number;
    gold: number;
    tasks: TaskStoreState[];
}

export interface Props {
    type: Structure;
}

type AllProps = Props & StateProps & DispatchProps;

const ProductionStructureView = (props: AllProps) => {

    const [selectedItem, setSelectedItem] = useState<Item>();
    const [workersAssigned, setWorkersAssigned] = useState<number>(0);


    const structureDefinition = getDefinition<ProductionStructureDefinition>(props.type);
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type}
            with type ProductionStructureDefinition.`);
    }
    const level: number =   props.level || 0;
    const levelDefinition: ProductionStructureLevelDefinition = structureDefinition.levels[level];
    const displayName = TextManager.getStructureName(props.type);

    const createUpgradeRow = () => {
        const gold = props.gold;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onUpgrade) { props.onUpgrade(nextLevelCost, level + 1); }
        };
        return <div>
            <label>level:</label>{ (level + 1) + " / " + structureDefinition.levels.length }
            <button
                style={{float: "right"}}
                onClick = { handleClick }
                disabled= { !canUpgrade } >
                    { upgradeText }
            </button>
        </div>;
    };

    const createCraftTabs = () => {

        return levelDefinition.produces.map((produces) => {
            const handleSelectCraftingItem = (e: React.MouseEvent) => {
                e.stopPropagation();

                setSelectedItem(produces.item);
            };

            return <li
                key = { `craft${produces.item}`}
                onClick = { handleSelectCraftingItem }
                className = { selectedItem === produces.item ? "selected" : "" }
            >
                <ItemIcon item= { produces.item }  />
                { TextManager.getItemName(produces.item) }
            </li>;
        });
    };

    const createCraftingDetails = () => {
        const item = selectedItem;
        if (!item) { return null; }

        const produces = levelDefinition.produces.find((p) => p.item === item)!;
        const playerResources = props.resources || {};
        const costResources = produces.cost.resources!;
        const missingAtLeastOneResource = Object.keys(costResources)
            .some((resource) => costResources[resource] > playerResources[resource]);

        let missingAtLeastOneItem = false;
        const costMaterials = produces.cost.materials;
        if (costMaterials) {
            missingAtLeastOneItem = costMaterials
                .some((i: Item) => props.items.indexOf(i) === -1);
        }

        const disabled = missingAtLeastOneResource || missingAtLeastOneItem || workersAssigned < 1;
        // TODO: [10/07/2019] Perhaps each item can have a number of minimum workers?

        const itemDefinition: ItemDefinition = itemDefinitions[item];

        const makeTimeString = (time: number): string => {
            if (workersAssigned === 0) {
                return "";
            }
            const craftingTime = calculateProductionTime(time, workersAssigned);
            const formatted = formatDuration(craftingTime);
            return ` Crafting time: ${formatted}`;
        };

        const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();

            if (props.onCraft) {
                props.onCraft(produces, workersAssigned);
                setWorkersAssigned(0);
            }
        };

        const handleUp = (e: React.MouseEvent) => {
            e.stopPropagation();
            setWorkersAssigned(workersAssigned + 1);
        };

        const handleDown = (e: React.MouseEvent) => {
            e.stopPropagation();
            setWorkersAssigned(workersAssigned - 1);
        };

        let costItemsContent = null;
        if (costMaterials) {
            costItemsContent = <MaterialsCostBox items = { costMaterials } />;
        }
        return (
            <div className = "crafting-details">
                Craft a { TextManager.getItemName(itemDefinition.item) }
                <div className = "crafting-costs">
                    <fieldset>
                        <ResourcesCostBox resources = { costResources } />
                    </fieldset>
                    <fieldset>
                        { costItemsContent }
                    </fieldset>
                </div>
                <div style={ { display: "flex "}}>
                    <UpDownValue
                        value = { workersAssigned }
                        label ={ "Workers: " }
                        onUp = { handleUp }
                        onDown = { handleDown }
                        upDisabled={
                            workersAssigned >= props.workersFree ||
                            workersAssigned >= MAX_WORKERS_CRAFTING
                        }
                        downDisabled={ workersAssigned < 1 }
                    />
                    &nbsp;
                    { makeTimeString(produces.cost.time || 0) }
                </div>
                <div>
                    <button
                        disabled = { disabled }
                        onClick = { handleClick }>
                        Craft
                    </button>
                </div>
            </div>
        );
    };

    const createProgressbars = () => {
        const tasks = props.tasks || [];
        return tasks.map((t) => <Progressbar
            key = { `${t.name}${t.startTime}` }
            label = { `${t.name} (${formatDuration(t.timeRemaining)})` }
            progress = { t.progress }/>,
        );
    };

    return (
        // TODO: abstract some stuff to generic StructureView
        <details open = { true } className = "productionstructureview">
            <summary>{displayName}</summary>
            <section>
                { createUpgradeRow() }
                <div>craft:</div>
                {/* { createCraftRows() } */}
                <div className="crafting-area">
                    <ul className="vertical-tab-bar">
                        { createCraftTabs() }
                    </ul>
                    { createCraftingDetails() }
                </div>
                <fieldset>
                    <legend>Currently crafting:</legend>
                    { createProgressbars() }
                </fieldset>
            </section>
        </details>
    );
}

export default ProductionStructureView;
