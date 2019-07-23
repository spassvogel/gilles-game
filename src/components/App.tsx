// tslint:disable: object-literal-sort-keys
import { ContextInfo, ContextType } from "constants/context";
import { Windows } from "constants/ui";
import AdventurersBox from "containers/AdventurersBox";
import SimpleLog from "containers/log/SimpleLog";
import RealWorldView from "containers/partyScreen/RealWorldView";
import RealTownView from "containers/RealTownView";
import StructureDetailsView from "containers/structures/StructureDetailsView";
import CheatBox from "containers/windows/CheatBox";
import { AppContextProps } from "hoc/withAppContext";
import { Placement } from "hoc/withPopup";
import { manifest } from "manifest/app";
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import posed, { PoseGroup } from "react-pose";
import { BrowserRouter as Router, Link, Redirect, Route } from "react-router-dom";
import { Persistor } from "redux-persist";
import { Sound, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
import Topbar from "../containers/Topbar";
import { Structure } from "../definitions/structures";
import "./css/app.css";
import Preloader, { MediaItem, MediaType } from "./preloading/Preloader";
import ContextView from "./ui/context/ContextView";
import Menu from "./ui/window/windows/Menu";

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
    media: MediaItem[];
    selectedStructure: Structure | null;

    contextType: ContextType | null;
    contextInfo: ContextInfo | null;
    contextRect: ClientRect | null;
    containerRect: ClientRect | null;

    activeWindows: Windows[];
}

const resolution = {
    height: 860, // 972,
    width: 648,
};

export const AppContext = React.createContext<AppContextProps | null>(null);

export default class App extends React.Component<Props & StateProps & DispatchProps, LocalState> {
    private containerRef: React.RefObject<HTMLDivElement>;

    // This Component has local state, so it"s a class
    constructor(props: Props & StateProps & DispatchProps) {
        super(props);

        this.state = {
            containerRect: null,
            contextInfo: null,
            contextType: null,
            contextRect: null,
            media: [],
            selectedStructure: null,
            activeWindows: [],
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

        const handleViewButtonClick = () => {
            SoundManager.playSound(Sound.buttonClick);
        };

        const handleResetClick = () => {
            this.props.persistor.purge();
            window.location.reload();
        };

        const getAdventurersBox = () => {
            return <AdventurersBox />;
        };

        // Router elements
        const TownButton = () => <Link to="/town">
            <button onClick= { () => handleViewButtonClick() }> { TextManager.get(`common-view-button-town`) } </button>
        </Link>;

        const WorldButton = () => <Link to="/world">
            <button onClick= { () => handleViewButtonClick() }> { TextManager.get(`common-view-button-world`) } </button>
        </Link>;

        const TownView = ()  => <RealTownView onStructureClick = { this.selectStructure } />;
        const WorldView = () => <RealWorldView/>;

        // A contextual popup showing what you just clicked. Can be an Item
        let ContextPopup = null;
        if (this.state.containerRect && this.state.contextRect) {

            ContextPopup = <ContextView
                type = { this.state.contextType }
                info = { this.state.contextInfo }
                containerRect = { this.state.containerRect }
                referenceRect = { this.state.contextRect }
                placement = { Placement.top }
            >
            </ContextView>;
        }

        const Window = this.getActiveWindow();

        return <AppContext.Provider value = {{
            media: this.state.media,
            onContextualObjectActivated: this.handleContextualObjectActivated,
            onOpenWindow: this.handlePopupOpened,
        }}>
            <div className = "app"
                ref = { this.containerRef }
                style = {{
                    width: resolution.width,
                    height: resolution.height,
                }}
                onClick = { this.handleAppClick }
            >
                <DndProvider backend={ HTML5Backend }>
                <Router>
                    <Preloader
                        manifest = { manifest }
                        onLoadComplete = { this.handleMediaLoadComplete }
                    >
                    <Topbar/>
                    <Redirect from="/" to="town" />
                    <Route path="/world" component = { TownButton } />
                    <Route path="/town" component = { WorldButton } />
                    { ` | ` }
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
                    <Route path="/town" component = { TownView } />
                    <Route path="/world" component = { WorldView } />
                <div className="app-right">
                    { getAdventurersBox() }
                </div>
                { Window }
                { ContextPopup }
                <SimpleLog/>
                </Preloader>
                </Router>
                </DndProvider>
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

    private getActiveWindow(): React.ReactElement | null {
        if (!this.state.activeWindows.length) {
            return null;
        }

        const topWindow = this.state.activeWindows[this.state.activeWindows.length - 1];
        const commonWindowProps = {
            onClose: this.handleWindowClose,
            onBack: this.handleWindowBack,
            backEnabled: this.state.activeWindows.length > 1,
            closeEnabled: true,
        };

        switch (topWindow) {
            case Windows.cheats:
                return <CheatBox { ...commonWindowProps } title = "Cheats" />;

            case Windows.menu:
                return <Menu { ...commonWindowProps } title = "Menu" />;

            default:
                return null;
        }
    }

    private updateDimensions() {
        if (this.containerRef.current) {
            if (window.innerHeight < resolution.height) {
                this.containerRef.current.style.transform = `scale(${window.innerHeight / resolution.height}) translateX(-50%)`;

            } else {
                this.containerRef.current.style.transform = `scale(1) translateX(-50%)`;
            }
            const parentBox = this.containerRef.current.getBoundingClientRect();
            this.setState({
                containerRect: parentBox,
            });
        }
    }

    private selectStructure = (structure: Structure | null) => {
        // could structure be a Window?
        this.setState({
            selectedStructure: structure,
        });
    }

    private closeStructureModal = () => {
        // could structure be a Window?
        this.setState({
            selectedStructure: null,
        });
    }

    private handleMediaLoadComplete = (media: MediaItem[]) => {

        const sounds = media.filter((m) => m.mediaType === MediaType.sound);
        SoundManager.loadMedia(sounds);

        SoundManager.addSounds({
            [Sound.buttonClick]: "sound/fx/button-click.ogg",
            // add more sounds here
        });

        this.setState({
            media,
        });
    }

    private handleContextualObjectActivated = (type: ContextType, info: ContextInfo, origin: React.RefObject<any>, originRect: ClientRect) => {

        // todo: 20/07/2019 contextual popup
        this.setState({
            contextInfo: info,
            contextType: type,
            contextRect: originRect,
        });
    }

    private handleAppClick = () => {
        if (this.state.contextRect) {
            this.setState({
                contextRect: null,
            });
        }
    }

    private handlePopupOpened = (window: Windows) => {
        this.setState({
            activeWindows: [
                ...this.state.activeWindows,
                window,
            ],
        });
    }

    /**
     * Closes all windows
     */
    private handleWindowClose = () => {
        if (this.state.activeWindows.length) {
            this.setState({
                activeWindows: [],
            });
        }
    }

    /**
     * Closes the top window of the stack
     */
    private handleWindowBack = () => {
        if (this.state.activeWindows.length) {
            this.setState({
                activeWindows: this.state.activeWindows.slice(0, -1),
            });
        }
    }
}
