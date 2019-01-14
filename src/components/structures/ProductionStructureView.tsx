// OBSOLETE
import * as React from "react";
import itemDefinitions from "src/definitions/items";
import { ItemDefinition } from "src/definitions/items/types";
import { ProductionDefinition } from "src/definitions/production/types";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { ProductionStructureDefinition, ProductionStructureLevelDefinition } from "src/definitions/structures/types";
import { ResourceStoreState } from "src/stores/resources";
import { TaskStoreState } from "src/stores/task";
import Progressbar from "../ui/Progressbar";
import UpDownValue from "../ui/UpDownValue";
import "./css/structureviewrow.css";

export interface DispatchProps {
    onUpgrade?: (cost: number) => void;
    onWorkersUp?: () => void;
    onWorkersDown?: () => void;
    onCraft?: (productionDefinition: ProductionDefinition) => void;
}

export interface StateProps {
    resources: ResourceStoreState;
    level: number;
    workers: number;
    workersFree: number;
    gold: number;
    tasks: TaskStoreState[];
}

export interface Props extends DispatchProps {
    type: Structure;
}

export default function(props: Props & StateProps) {

    const structureDefinition  = structureDefinitions[props.type] as ProductionStructureDefinition;
    if (!structureDefinition) {
        throw new Error(`No definition found for structure ${props.type} with type ProductionStructureDefinition.`);
    }
    const level: number = props.level || 0;
    const levelDefinition: ProductionStructureLevelDefinition = structureDefinition.levels[level];

    const createWorkersRow = () => {

        const handleUp = () => {
            if (props.onWorkersUp) { props.onWorkersUp(); }
        };
        const handleDown = () => {
            if (props.onWorkersDown) { props.onWorkersDown(); }
        };

        const upDisabled = props.workers === levelDefinition.workerCapacity || (props.workersFree || 0) < 1;
        const downDisabled = props.workers === 0;
        return <UpDownValue
            label="workers:"
            value = { props.workers }
            max = { levelDefinition.workerCapacity }
            upDisabled = { upDisabled }
            downDisabled = { downDisabled }
            onDown = { handleDown }
            onUp = { handleUp }
        />;
    };

    const createUpgradeRow = () => {
        const gold = props.gold;
        const nextLevel = structureDefinition.levels[level + 1];
        const nextLevelCost = (nextLevel != null ? nextLevel.cost : -1);
        const canUpgrade = nextLevel != null && gold >= nextLevelCost;
        const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (props.onUpgrade) { props.onUpgrade(nextLevelCost); }
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

    const createCraftRows = () => {
        const handleClick = (productionDefinition: ProductionDefinition) => {
            if (props.onCraft) { props.onCraft(productionDefinition); }
        };

        /**
         * Formats the requirements for this equipment in a nice string
         * @param costs
         */
        const makeCostsString = (costs: ResourceStoreState): string => {
            return Object.keys(costs).reduce((accumulator: string[], value) => {
                if (costs[value]) { accumulator.push(`${value}: ${costs[value]}`); }
                return accumulator;
            }, []).join(", ");
        };

        return levelDefinition.produces.map((produces) => {
            // Check if we have enough resources
            const playerResources = props.resources || {};
            const disabled = Object.keys(produces.cost)
                .some((resource) => produces.cost[resource] > playerResources[resource]);
            const equipmentDefinition: ItemDefinition = itemDefinitions[produces.equipment];

            return <div key = { "craft" + produces.equipment } >
                <button
                    disabled = {disabled}
                    onClick = { () => handleClick(produces) }>
                    { equipmentDefinition.name }
                </button>
                { makeCostsString(produces.cost) }
            </div>;
        });
    };

    const createProgressbars = () => {
        const tasks = props.tasks || [];
        return tasks.map((t) => <Progressbar
            key = { `${t.name}${t.startTime}` }
            label = { t.name }
            progress = { t.progress }/>,
        );
    };

    return (
        // Todo: abstract some stuff to generic StructureView
        <details open = { true } className = "structureview">
            <summary>{levelDefinition.displayName}</summary>
            <section>
                { createWorkersRow() }
                { createUpgradeRow() }
                <div>craft:</div>
                { createCraftRows() }
                { createProgressbars() }
            </section>
        </details>
    );
}
