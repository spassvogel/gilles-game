import * as React from "react";
import { ContextInfo, ContextType } from "src/constants";
import { Resource } from "src/definitions/resources";
import { ResourceStoreState } from "src/stores/resources";
import PartyScreen from "../containers/partyScreen/PartyScreen";
import ResourceViewRow from "../containers/ResourceViewRow";
import Topbar from "../containers/Topbar";
import { Structure } from "../definitions/structures";
import ContextView from "./ContextView";
import "./css/app.css";
import RealTownView from "./RealTownView";
import StructureDetailsView from "./StructureDetailsView";

// tslint:disable-next-line:no-empty-interface
export interface StateProps {
}

export interface DispatchProps {
    onCheatGold?: (amount: number) => void;
    onCheatResources?: (amount: ResourceStoreState) => void;
}

export enum View {
    Town,
    World,
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
    view: View;
    selectedStructure: Structure | null;
    contextType: ContextType | null;
    contextInfo: ContextInfo | null;
}

// Sharing context within the entire App
export interface AppContextProps {
    onContextualObjectActivated: (type: ContextType, info: ContextInfo) => void;
}
export const AppContext = React.createContext<AppContextProps>({
    onContextualObjectActivated: () => {},
});
export const AppContextConsumer = AppContext.Consumer;

export default class App extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    // This Component has local state, so it's a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            contextInfo: null,
            contextType: null,
            selectedStructure: null,
            view:  View.Town,
        };
    }

    public render() {
        const selectedStructureView = this.state.selectedStructure ?
            <StructureDetailsView structure = { this.state.selectedStructure }/> : null;

        const mainView = this.state.view === View.Town ? <RealTownView onStructureClick= { this.selectStructure }/>
            : <PartyScreen questName="A quest called tribe"></PartyScreen>;

        const contextView = this.state.contextType == null || this.state.contextInfo == null ? null :
            <ContextView type = { this.state.contextType }  info = { this.state.contextInfo }/>;

        return <AppContext.Provider value = {{
            onContextualObjectActivated: this.handleContextualObjectActivated,
        }}>
            <Topbar appView = { this.state.view } onViewButtonClick= { () => this.changeView() }/>
            {/* <div className="app-left"> */}
                {/* <TownView onStructureClick= { this.selectStructure }/> */}
                { selectedStructureView }
                {/* <fieldset>
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
                </fieldset> */}
                { mainView }
            {/* </div> */}
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
                {
                    contextView
                }
            </div>
        </AppContext.Provider>;
    }
    private changeView = () => {
        if (this.state.view === View.Town) {
            this.setState({
                selectedStructure: null,
                view: View.World,
            });
        } else {
            this.setState({ view: View.Town });
        }
    }

    private selectStructure = (structure: Structure) => {
        this.setState({
            selectedStructure: structure,
        });
    }

    private handleContextualObjectActivated = (type: ContextType, info: ContextInfo) => {
        this.setState({
            contextInfo: info,
            contextType: type,
        });
    }

    private handleCheatGold = (amount: number) => {
        if (this.props.onCheatGold) { this.props.onCheatGold(amount); }
    }

    private handleCheatResources = (amount: ResourceStoreState) => {
        if (this.props.onCheatResources) { this.props.onCheatResources(amount); }
    }
}
