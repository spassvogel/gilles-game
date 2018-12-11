import * as React from "react";
import TownView from "src/containers/TownView";
import { Resource } from "src/definitions/resources";
import { ResourceStoreState } from "src/stores/resources";
import PartyScreen from "../containers/partyScreen/PartyScreen";
import ResourceViewRow from "../containers/ResourceViewRow";
import Topbar from "../containers/Topbar";
import { Structure } from "../definitions/structures";
import "./css/app.css";
import StructureDetailsView from "./StructureDetailsView";
import RealTownView from "./RealTownView";

// tslint:disable-next-line:no-empty-interface
export interface StateProps {
}

export interface DispatchProps {
    onCheatGold?: (amount: number) => void;
    onCheatResources?: (amount: ResourceStoreState) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
    selectedStructure: Structure | null;
}

export default class App extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    // This Component has local state, so it's a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            selectedStructure: null,
        };
    }

    public render() {
        const selectedStructureView = this.state.selectedStructure ?
            <StructureDetailsView structure = { this.state.selectedStructure }/> : null;

        return <div>
            <Topbar/>
            <div className="app-left">
                <TownView onStructureClick= { this.selectStructure }/>
                { selectedStructureView }
                <fieldset>
                    <legend>Cheats</legend>
                    <button onClick={ () => this.handleCheatGold(20)}> Geiv 20 gold</button><br/>
                    <button onClick={ () => this.handleCheatResources({
                        food: 100,
                        gunpowder: 100,
                        iron: 100,
                        leather: 100,
                        steel: 100,
                        wood: 100,
                    })}> Geiv 100 all resources</button>
                </fieldset>
                <RealTownView/>
            </div>
            <PartyScreen questName="A quest called tribe"></PartyScreen>
            <div className="app-right">
                <fieldset className="resources">
                    <legend>Resources</legend>
                    <ResourceViewRow type = { Resource.wood }/>
                    <ResourceViewRow type = { Resource.iron }/>
                    <ResourceViewRow type = { Resource.steel }/>
                    <ResourceViewRow type = { Resource.food }/>
                    <ResourceViewRow type = { Resource.gunpowder }/>
                    <ResourceViewRow type = { Resource.leather }/>
                </fieldset>
            </div>
        </div>;
    }

    private selectStructure = (structure: Structure) => {
        this.setState({
            selectedStructure: structure,
        });
    }

    private handleCheatGold = (amount: number) => {
        if (this.props.onCheatGold) { this.props.onCheatGold(amount); }
    }

    private handleCheatResources = (amount: ResourceStoreState) => {
        if (this.props.onCheatResources) { this.props.onCheatResources(amount); }
    }
}
