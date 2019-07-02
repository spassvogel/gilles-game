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
    // This Component has local state, so it"s a class
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

        const StructureViewModal = posed.div({
            enter: {
                opacity: 1,
                transform: "scale(1)",
                transition: {
                     duration: 200,
                     ease: "easeInOut",
                },
            },
            exit: {
                opacity: 0,
                transform: "scale(0.5)",
                transition: {
                    duration: 150,
                    ease: "easeInOut",
                },
            },
        });
        const ModalBackground = posed.div({
            enter: { opacity: 1 },
            exit: { opacity: 0 },
        });

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
        { <PoseGroup>
            { !!selectedStructureView && [
                <StructureViewModal key="structure-modal" className="structure-modal">
                    { selectedStructureView }
                </StructureViewModal>,
                <ModalBackground key="structure-modal-bg" className="structure-modal-background" onClick= { () => this.closeStructureModal() } />,
                ]
            }
        </PoseGroup>}
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

    private closeStructureModal = () => {
        this.setState({
            selectedStructure: null,
        });
    }

    private handleMediaLoadComplete = (media: MediaItem[]) => {
        this.setState({
            media,
        });
    }


    private handleContextualObjectActivated = (type: ContextType, info: ContextInfo) => {
       setState({
             contextInfo: info,
             contextType: type,
        });
    }

}
