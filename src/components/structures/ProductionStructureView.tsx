// OBSOLETE
import * as React from "react";
import itemDefinitions from "src/definitions/items";
import { ItemDefinition, Item } from "src/definitions/items/types";
import { ProductionDefinition } from "src/definitions/production/types";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { ProductionStructureDefinition, ProductionStructureLevelDefinition } from "src/definitions/structures/types";
import { ResourceStoreState } from "src/stores/resources";
import { TaskStoreState } from "src/stores/task";
import Progressbar from "../ui/Progressbar";
import UpDownValue from "../ui/UpDownValue";
import "./css/structureviewrow.css";
import DraggableItemIcon from "../ui/DraggableItemIcon";
import ItemIcon from "../ui/ItemIcon";

export interface DispatchProps {
    onUpgrade?: (cost: number) => void;
    onCraft?: (productionDefinition: ProductionDefinition) => void;
}

export interface StateProps {
    resources: ResourceStoreState;
    level: number;
    workersFree: number;
    gold: number;
    tasks: TaskStoreState[];
}

export interface Props {
    type: Structure;
}

type AllProps = Props & StateProps & DispatchProps;

interface LocalState {
    selectedItem: Item;
    workersAssigned: number;
}

export default class ProductionStructureView extends React.Component<AllProps, LocalState> {

    public render() {
        const structureDefinition  = structureDefinitions[this.props.type] as ProductionStructureDefinition;
        if (!structureDefinition) {
            throw new Error(`No definition found for structure ${this.props.type}
                with type ProductionStructureDefinition.`);
        }
        const level: number = this.props.level || 0;
        const levelDefinition: ProductionStructureLevelDefinition = structureDefinition.levels[level];

        const createUpgradeRow = () => {
            const gold = this.props.gold;
            const nextLevel = structureDefinition.levels[level + 1];
            const nextLevelCost = (nextLevel != null ? nextLevel.cost : -1);
            const canUpgrade = nextLevel != null && gold >= nextLevelCost;
            const upgradeText = `Upgrade! (${nextLevelCost < 0 ? "max" : nextLevelCost + " gold"})`;

            const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                if (this.props.onUpgrade) { this.props.onUpgrade(nextLevelCost); }
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
                if (this.props.onCraft) { this.props.onCraft(productionDefinition); }
            };

            /**
             * Formats the requirements for this equipment in a nice string
             * @param costs
             */
            const makeCostsString = (costs: ResourceStoreState): string => {
                return Object.keys(costs).reduce((accumulator: string[], value) => {
                    if (costs[value]) { accumulator.push(`${value}: ${costs[value]}`); }
                    return accumulator;
                }, []).join(", ") + ". ";
            };

            const makeTimeString = (time: number): string => {
                return "Time: " + time + "ms";
            };

            return levelDefinition.produces.map((produces) => {
                // Check if we have enough resources
                const playerResources = this.props.resources || {};
                const disabled = Object.keys(produces.cost)
                    .some((resource) => produces.cost[resource] > playerResources[resource]);
                const itemDefinition: ItemDefinition = itemDefinitions[produces.item];

                const handleUp = () => {

                };

                const handleDown = () => {

                };

                return <div key = { "craft" + produces.item } className="crafting-row">
                    <ItemIcon item= { produces.item } />

                    { itemDefinition.name }
                    <UpDownValue
                        value={ 0 }
                        label={ "Workers: " }
                        onUp={ handleUp }
                        onDown={ handleDown }
                    />
                    <button
                        disabled={ disabled }
                        onClick={ () => handleClick(produces) }>
                        Craft
                    </button>
                    { makeCostsString(produces.cost) }
                    { makeTimeString(produces.time) }
                </div>;
            });
        };

        const createProgressbars = () => {
            const tasks = this.props.tasks || [];
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
                    { createUpgradeRow() }
                    <div>craft:</div>
                    { createCraftRows() }
                    { createProgressbars() }
                </section>
            </details>
        );
    }
}
