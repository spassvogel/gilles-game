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
import { AppContextProps } from "hoc/withAppContext";

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
    contextPosition: { x: number, y: number };
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
            contextInfo: null,
            contextType: null,
            media: [],
            selectedStructure: null,
            contextPosition: { x: 20, y: 100 },
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

        const handleViewClick = () => {
            SoundManager.playSound(Sound.buttonClick);
        };

        const handleResetClick = () => {
            this.props.persistor.purge();
            window.location.reload();
        };

        /*const contextView = this.state.contextType == null || this.state.contextInfo == null ? null :
        <ContextView type = { this.state.contextType }  info = { this.state.contextInfo }/>;*/

        const getAdventurersBox = () => {
            return <AdventurersBox />;
        };

        // Router elements
        const TownButton = () => <Link to="/town">
            <button onClick= { () => handleViewClick() }> { TextManager.get(`common-view-button-town`) } </button>
        </Link>;

        const WorldButton = () => <Link to="/world">
            <button onClick= { () => handleViewClick() }> { TextManager.get(`common-view-button-world`) } </button>
        </Link>;

        const TownView = ()  => <RealTownView onStructureClick = { this.selectStructure } />;
        const WorldView = () => <RealWorldView/>;

        return <AppContext.Provider value = {{
            media: this.state.media,
            onContextualObjectActivated: this.handleContextualObjectActivated,
            onPopupOpened: this.handlePopupOpened,
        }}>
            <div className="app"
                ref = { this.containerRef }
                style = {{
                    width: resolution.width,
                    height: resolution.height,
                }}
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
                <CheatBox />
                </div>
                <ContextView type = { this.state.contextType }  info = { this.state.contextInfo } position = { this.state.contextPosition }></ContextView>
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

    private updateDimensions() {
        if (this.containerRef.current) {
            if (window.innerHeight < resolution.height) {
                this.containerRef.current.style.transform = `scale(${window.innerHeight / resolution.height}) translateX(-50%)`;

            } else {
                this.containerRef.current.style.transform = `scale(1) translateX(-50%)`;
            }
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
            // add more sounds here
        });

        this.setState({
            media,
        });
    }

    public componentDidUpdate() {
        // if (this.containerRef.current && this.state.origin) {
        //     const origin = this.state.origin;
        //     const reference = origin as Element;
        //     //const contentBox = this.containerRef.current.querySelector(".contentbox")!;
        //     const contentBox = this.containerRef.current.childNodes[8] as Element;
        //     //const contentBox = this.contextRef.current as unknown as  Element;
        //     console.log(contentBox)
        //     var rect = (origin as HTMLElement).getBoundingClientRect();
        //     console.log ({x:rect.left,y:rect.top});
    
        //     //const popperInstance = new Popper(reference, contentBox);
        // }
    }

    private handleContextualObjectActivated = (type: ContextType, info: ContextInfo, origin: ClientRect) => {

        if (this.containerRef.current) {
            const parentBox = this.containerRef.current.getBoundingClientRect();

            // position bottom, centered
            const position = {
                x: origin.left - parentBox.left + (origin.width / 2),
                y: origin.top - parentBox.top + (origin.height),
            };

            // todo: 20/07/2019 contextual popup
            this.setState({
                contextInfo: info,
                contextType: type,
                contextPosition: position,
            });
        }
    }

    private handlePopupOpened = (name: string) => {
        console.log("opened " + name);
    }
}
