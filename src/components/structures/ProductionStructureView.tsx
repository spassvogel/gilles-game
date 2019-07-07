import * as React from "react";
import { ContextType } from "src/constants";
import itemDefinitions from "src/definitions/items";
import { Item, ItemDefinition } from "src/definitions/items/types";
import { ProductionDefinition } from "src/definitions/production/types";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { ProductionStructureDefinition, ProductionStructureLevelDefinition } from "src/definitions/structures/types";
import { calculateProductionTime, MAX_WORKERS_CRAFTING } from "src/mechanics/crafting";
import { ResourceStoreState } from "src/stores/resources";
import { TaskStoreState } from "src/stores/task";
import { TextManager } from "src/utils/textManager";
import { formatDuration } from "src/utils/time";
import { AppContextProps } from "../App";
import ItemIcon from "../ui/ItemIcon";
import Progressbar from "../ui/Progressbar";
import UpDownValue from "../ui/UpDownValue";
import "./css/productionstructureview.css";

export interface DispatchProps {
    onUpgrade?: (cost: number) => void;
    onCraft?: (productionDefinition: ProductionDefinition, workers: number) => void;
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

type AllProps = Props & StateProps & DispatchProps & AppContextProps;

interface LocalState {
    selectedItem: Item|null;
    workersAssigned: number;
}

export default class ProductionStructureView extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            selectedItem: null,
            workersAssigned: 0,
        };
    }

    // public componentDidUpdate(prevProps: AllProps, prevState: LocalState) {
    //     console.log("cdu" + prevProps.workersFree);
    // }

    public componentWillMount() {
        console.log("component will mount" + this.props.type);
    }
    public componentWillUnmount() {
        console.log("component will unmount" + this.props.type);
    }

    public render() {
        const structureDefinition  = structureDefinitions[this.props.type] as ProductionStructureDefinition;
        if (!structureDefinition) {
            throw new Error(`No definition found for structure ${this.props.type}
                with type ProductionStructureDefinition.`);
        }
        const level: number = this.props.level || 0;
        const levelDefinition: ProductionStructureLevelDefinition = structureDefinition.levels[level];
        const displayName = TextManager.get(levelDefinition.displayName);

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


        const createCraftTabs = () => {
            const selectedItem = this.state.selectedItem;

            return levelDefinition.produces.map((produces) => {
                const itemDefinition: ItemDefinition = itemDefinitions[produces.item];
                return <li
                    key={ `craft${produces.item}`}
                    onClick={ () => handleSelectCraftingItem(produces.item) }
                    className={ selectedItem === produces.item ? "selected" : "" }
                >
                    <ItemIcon item= { produces.item } />
                    { itemDefinition.name }
                </li>;
            });
        };

        const createCraftingDetails = () => {
            const item = this.state.selectedItem;
            if (!item) { return null; }

            const produces = levelDefinition.produces.find((p) => p.item === item)!;
            const playerResources = this.props.resources || {};
            const missingAtLeastOneResource = Object.keys(produces.cost)
                .some((resource) => produces.cost[resource] > playerResources[resource]);
            const disabled = missingAtLeastOneResource || this.state.workersAssigned < 1;
            // TODO: Perhaps each item can have a number of minimum workers?
            // TODO: We could explain what is the reason we can't craft the item

            const itemDefinition: ItemDefinition = itemDefinitions[item];

            const makeCostsString = (costs: ResourceStoreState): string => {
                return Object.keys(costs).reduce((accumulator: string[], value) => {
                    if (costs[value]) { accumulator.push(`${value}: ${costs[value]}`); }
                    return accumulator;
                }, []).join(", ") + ". ";
            };

            const makeTimeString = (time: number): string => {
                if (this.state.workersAssigned === 0) {
                    return "";
                }
                const craftingTime = calculateProductionTime(time, this.state.workersAssigned);
                const formatted = formatDuration(craftingTime);
                return ` Crafting time: ${formatted}`;
            };

            const handleClick = (productionDefinition: ProductionDefinition) => {
                if (this.props.onCraft) {
                    this.props.onCraft(productionDefinition, this.state.workersAssigned);
                    this.setState({
                        workersAssigned: 0,
                    });
                }
            };

            const handleUp = () => {
                this.setState({
                    workersAssigned: this.state.workersAssigned + 1,
                });
            };

            const handleDown = () => {
                this.setState({
                    workersAssigned: this.state.workersAssigned - 1,
                });
            };

            return (
                <div className = "crafting-details">
                    Craft a { itemDefinition.name }
                    <div>
                        { makeCostsString(produces.cost) }
                    </div>
                    <div style={ { display: "flex "}}>
                        <UpDownValue
                            value={ this.state.workersAssigned }
                            label={ "Workers: " }
                            onUp={ handleUp }
                            onDown={ handleDown }
                            upDisabled={
                                this.state.workersAssigned >= this.props.workersFree ||
                                this.state.workersAssigned >= MAX_WORKERS_CRAFTING
                            }
                            downDisabled={ this.state.workersAssigned < 1 }
                        />
                        &nbsp;
                        { makeTimeString(produces.time) }
                    </div>
                    <div>
                        <button
                            disabled={ disabled }
                            onClick={ () => handleClick(produces) }>
                            Craft
                        </button>
                    </div>
                </div>
            );
        };

        const handleSelectCraftingItem = (item: Item) => {
            /* todo: setting state on the App causes this Component to be remounted. it's react-poses fault
            https://github.com/Popmotion/popmotion/issues/820
            this.props.onContextualObjectActivated(
                ContextType.item,
                itemDefinitions[item],
            );*/

            this.setState({
                selectedItem: item,
            });
        };

        const createProgressbars = () => {
            const tasks = this.props.tasks || [];
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
}
