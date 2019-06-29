import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Persistor } from "redux-persist";
import { ContextInfo, ContextType } from "src/constants";
import AdventurersBox from "src/containers/AdventurersBox";
import CheatBox from "src/containers/CheatBox";
import SimpleLog from "src/containers/log/SimpleLog";
import RealWorldView from "src/containers/partyScreen/RealWorldView";
import RealTownView from "src/containers/RealTownView";
import StructureDetailsView from "src/containers/structures/StructureDetailsView";
import { manifest } from "src/manifest/app";
import { ResourceStoreState } from "src/stores/resources";
import Topbar from "../containers/Topbar";
import { Structure } from "../definitions/structures";
import "./css/app.css";
import Preloader, { MediaItem } from "./preloading/Preloader";
import ContextView from "./ui/context/ContextView";

// tslint:disable-next-line:no-empty-interface
export interface StateProps {
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

export enum View {
    Town,
    World,
}

export interface Props {
    persistor: Persistor;
}

interface LocalState {
    view: View;
    media: MediaItem[];
    selectedStructure: Structure | null;
    contextType: ContextType | null;
    contextInfo: ContextInfo | null;
}

// Sharing context within the entire App
export interface AppContextProps {
    onContextualObjectActivated: (type: ContextType, info: ContextInfo) => void;
    media: MediaItem[];
}
export const AppContext = React.createContext<AppContextProps | null>(null);

export default class App extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    // This Component has local state, so it's a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            contextInfo: null,
            contextType: null,
            media: [],
            selectedStructure: null,
            view: View.Town,
        };
    }

    public render() {
        const selectedStructureView = this.state.selectedStructure ?
        <StructureDetailsView structure = { this.state.selectedStructure }/> : null;

        const getMainView = () => {
            if (this.state.view === View.Town) {

                return <RealTownView
                onStructureClick = { this.selectStructure }
                // onContextualObjectActivated = { this.handleContextualObjectActivated }
                // media = { this.state.media }
                />;
            } else {
                return <RealWorldView/>;
            }

        };

        const contextView = this.state.contextType == null || this.state.contextInfo == null ? null :
        <ContextView type = { this.state.contextType }  info = { this.state.contextInfo }/>;

        const getAdventurersBox = () => {
            return <AdventurersBox />;
        };

        return <AppContext.Provider value = {{
            media: this.state.media,
            onContextualObjectActivated: this.handleContextualObjectActivated,
        }}>
        <Preloader
            manifest = { manifest }
            onLoadComplete = { this.handleMediaLoadComplete }
        >
        <Topbar
            appView={ this.state.view }
            onViewButtonClick={ () => this.changeView() }
            persistor={ this.props.persistor }
        />
        {/* <div className="app-left"> */}
        {/* <TownView onStructureClick= { this.selectStructure }/> */}
        <PoseGroup>
            { selectedStructureView }
        </PoseGroup>
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
        { getMainView()  }
        {/* </div> */}
        <div className="app-right">
        { contextView }
        { getAdventurersBox() }
        <CheatBox />
        </div>
        <SimpleLog/>
        </Preloader>
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

    private handleMediaLoadComplete = (media: MediaItem[]) => {
        this.setState({
            media,
        });
    }

    private handleContextualObjectActivated = (type: ContextType, info: ContextInfo) => {
        this.setState({
            contextInfo: info,
            contextType: type,
        });
    }

}
