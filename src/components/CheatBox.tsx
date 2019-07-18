// TODO: Better name than this

import { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import structureDefinitions, { Structure  } from "definitions/structures";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "utils/textManager";
import "./css/cheatbox.css";

export interface DispatchProps {
    onCheatGold?: (amount: number) => void;
    onCheatWorkers?: (amount: number) => void;
    onCheatResources?: (amount: ResourceStoreState) => void;
    onCheatItem?: (item: Item) => void;
    onCheatStructureState?: (structure: Structure, state: StructureState) => void;
}

export interface StateProps {
    structures: StructuresStoreState;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
    gold: number;
    workers: number;
    resources: number;
}

/*
giive gold
give workers
set building state
*/
type AllProps = Props & StateProps & DispatchProps;
class CheatBox extends React.Component<AllProps, LocalState> {

    private itemSelectRef: React.RefObject<HTMLSelectElement>;
    /**
     *
     */
    constructor(props: AllProps) {
        super(props);

        this.state = {
            gold: 50,
            resources: 50,
            workers: 10,
        };

        this.itemSelectRef = React.createRef();
    }

    public render() {

        const getStructureRow = (structure: Structure) => {
            const structureDef = structureDefinitions[structure];
            const structureStore: StructureStoreState = this.props.structures[structure];
            const levelDef = structureDef.levels[structureStore.level];

            const displayName = TextManager.get(levelDef.displayName);

            return <div
                className="label-dropdown"
                key={structure}
            >
                <label title={structure}>
                    { `${displayName}` }
                </label>
                <input
                    key={structure}
                    type="checkbox"
                    checked={this.props.structures[structure].state === StructureState.Built }
                    onChange={ () => this.handleChangeStructureState(structure, this.props.structures[structure].state !== StructureState.Built)}
                />
            </div>;
        };

        const structures = Object.keys(this.props.structures)
            .map((structure) => getStructureRow(structure as Structure));

        const getItemTypeOptions = (type: ItemType) => {
            return Object.keys(Item)
                // tslint:disable-next-line: triple-equals
                .filter((item: string) => getDefinition(item as Item).itemType === type)
                .map((item: string) => getItemOption(item as Item));
        };

        const getItemOption = (item: Item) => {
            return <option value = { item } key = { item }>
                { TextManager.getItemName(item) }
            </option>;
        };

        const items = Object.keys(ItemType)
            .filter((val: any) => !isNaN(val))
            .map((type: string) => {
            return <optgroup label = { ItemType[type] } key = { type }>
                { getItemTypeOptions(type as unknown as ItemType) }
            </optgroup>;
        });

        return (
            <div className="cheat-box">
                <h3>CHEATS</h3>
                <div className="label-numberbox-button">
                    <label>Gold</label>
                    <input type="number"
                        value= {this.state.gold}
                        style={{width: "50px"}}
                        onChange={ this.handleChangeGold }>
                    </input>
                    <button onClick= { this.handleCheatGold }>Add</button>
                </div>
                <div className="label-numberbox-button">
                    <label>Workers</label>
                    <input type="number"
                        value= {this.state.workers}
                        style={{width: "50px"}}
                        onChange={ this.handleChangeWorkers }>
                    </input>
                    <button onClick= { this.handleCheatWorkers }>Add</button>
                </div>
                <div className="label-numberbox-button">
                    <label>Resources</label>
                    <input type="number"
                        value= {this.state.resources}
                        style={{width: "50px"}}
                        onChange={ this.handleChangeResources }>
                    </input>
                    <button onClick= { this.handleCheatResources }>Add</button>
                </div>
                <div className="label-numberbox-button">
                    <label>Items</label>
                    <select style={{ width: "150px"}} ref = { this.itemSelectRef }>
                        { items }
                    </select>
                    <button onClick= { this.handleCheatItem }>Add</button>
                </div>
                { structures }
            </div>
        );
    }

    private handleCheatGold = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount = this.state.gold;
        if (this.props.onCheatGold) { this.props.onCheatGold(amount); }
    }

    private handleCheatWorkers = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount = this.state.workers;
        if (this.props.onCheatWorkers) { this.props.onCheatWorkers(amount); }
    }

    private handleCheatResources = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const amount: ResourceStoreState = {
            food: this.state.resources,
            iron: this.state.resources,
            leather: this.state.resources,
            wood: this.state.resources,
        };

        if (this.props.onCheatResources) { this.props.onCheatResources(amount); }
    }

    private handleCheatItem = (evt: React.MouseEvent<HTMLButtonElement>) => {
        const item = this.itemSelectRef.current!.value as Item;
        if (this.props.onCheatItem) { this.props.onCheatItem(item); }
    }

    private handleChangeStructureState = (structure: Structure, checked: boolean) => {
        if (this.props.onCheatStructureState) {
            this.props.onCheatStructureState(structure, checked ? StructureState.Built : StructureState.NotBuilt);
        }
    }

    private handleChangeGold = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.value);
        this.setState({
            gold: amount,
        });
    }

    private handleChangeWorkers = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.value);
        this.setState({
            workers: amount,
        });
    }

    private handleChangeResources = (event: React.ChangeEvent<HTMLInputElement>) => {
        const amount = Number(event.target.checked);
        this.setState({
            resources: amount,
        });
    }
}

export default CheatBox;
