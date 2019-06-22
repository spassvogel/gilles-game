// TODO: Better name than this

import * as React from "react";
import structureDefinitions, { Structure  } from "src/definitions/structures";
import { ResourceStoreState } from "src/stores/resources";
import { StructureState, StructureStoreState } from "src/stores/structure";
import { StructuresStoreState } from "src/stores/structures";
import { TextManager } from "src/utils/textManager";
import "./css/cheatbox.css";

export interface DispatchProps {
    onCheatGold?: (amount: number) => void;
    onCheatWorkers?: (amount: number) => void;
    onCheatResources?: (amount: ResourceStoreState) => void;
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
