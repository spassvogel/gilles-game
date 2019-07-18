// tslint:disable: object-literal-sort-keys

import { ContextInfo, ContextType } from "constants/context";
import AdventurersBox from "containers/AdventurersBox";
import CheatBox from "containers/CheatBox";
import SimpleLog from "containers/log/SimpleLog";
import RealWorldView from "containers/partyScreen/RealWorldView";
import RealTownView from "containers/RealTownView";
import StructureDetailsView from "containers/structures/StructureDetailsView";
import { manifest } from "manifest/app";
import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Persistor } from "redux-persist";
import { Sound, SoundManager } from "utils/soundManager";
import Topbar from "../containers/Topbar";
import { Structure } from "../definitions/structures";
import "./css/app.css";
import Preloader, { MediaItem, MediaType } from "./preloading/Preloader";
import ContextView from "./ui/context/ContextView";
import { TextManager } from "utils/textManager";

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

const resolution = {
    height: 972,
    width: 648,
};

// Sharing context within the entire App
export interface AppContextProps {
    onContextualObjectActivated: (type: ContextType, info: ContextInfo) => void;
    media: MediaItem[];
}
export const AppContext = React.createContext<AppContextProps | null>(null);

export default class App extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    private containerRef: React.RefObject<HTMLDivElement>;

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
        this.containerRef = React.createRef();

        this.updateDimensions = this.updateDimensions.bind(this);
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

        const handleViewClick = () => {
            this.changeView();
        };

        const handleResetClick = () => {
            this.props.persistor.purge();
            window.location.reload();
        };

        const viewButtonText = this.state.view === View.Town ? TextManager.get(`common-view-button-world`) :
            TextManager.get(`common-view-button-town`);

        const contextView = this.state.contextType == null || this.state.contextInfo == null ? null :
        <ContextView type = { this.state.contextType }  info = { this.state.contextInfo }/>;

        const getAdventurersBox = () => {
            return <AdventurersBox />;
        };

        return <AppContext.Provider value = {{
            media: this.state.media,
            onContextualObjectActivated: this.handleContextualObjectActivated,
        }}>
            <div className="app" 
                ref = { this.containerRef }
                style = {{
                    width: resolution.width,
                    height: resolution.height,
                }}
            >
                <Preloader
                    manifest = { manifest }
                    onLoadComplete = { this.handleMediaLoadComplete }
                >
                <Topbar
                    appView={ this.state.view }
                    onViewButtonClick={ () => this.changeView() }
                    persistor={ this.props.persistor }
                />
                <button onClick= { () => handleViewClick() }> { viewButtonText } </button>
                { ` | `}
                <button onClick= { () => handleResetClick() } style={ { color: "red" } }> Restart! </button>

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
                <div className="app-right">
                    { contextView }
                    { getAdventurersBox() }
                <CheatBox />
                </div>
                <SimpleLog/>
                </Preloader>
            </div>
        </AppContext.Provider>;
    }

    public componentDidMount() {
        window.addEventListener("resize", this.updateDimensions);
        this.updateDimensions();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    private updateDimensions() {
        if(this.containerRef.current) {
            if (window.innerHeight < resolution.height){
                this.containerRef.current.style.transform = `scale(${window.innerHeight / resolution.height}) translateX(-50%)`;

            } else {
                this.containerRef.current.style.transform = `scale(1) translateX(-50%)`;
            }
        }
    }

    private changeView = () => {
        SoundManager.playSound(Sound.buttonClick);

        if (this.state.view === View.Town) {
            this.setState({
                selectedStructure: null,
                view: View.World,
            });
        } else {
            this.setState({ view: View.Town });
        }
    }

    private selectStructure = (structure: Structure | null) => {
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

        const sounds = media.filter((m) => m.mediaType === MediaType.sound);
        SoundManager.loadMedia(sounds);

        SoundManager.addSounds({
            [Sound.buttonClick]: "sound/fx/button-click.ogg",
        });

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
