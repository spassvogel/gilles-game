// tslint:disable: object-literal-sort-keys
import { ContextInfo, ContextType} from "constants/context";
import CombatView from "containers/combat/CombatView";
import SimpleLog from "containers/log/SimpleLog";
import RealTownView from "containers/RealTownView";
import StructureDetailsView from "containers/structures/StructureDetailsView";
import RealWorldView from "containers/world/RealWorldView";
import { AppContextProps} from "hoc/withAppContext";
import { Placement} from "hoc/withPopup";
import { manifest} from "manifest/app";
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { DndProvider} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { BrowserRouter as Router, Link, Redirect, Route} from "react-router-dom";
import { Persistor} from "redux-persist";
import { Sound, SoundManager} from "utils/soundManager";
import { TextManager} from "utils/textManager";
import Topbar from "../containers/Topbar";
import { Structure} from "../definitions/structures";
import "./css/app.css";
import Preloader, { MediaItem, MediaType} from "./preloading/Preloader";
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

interface SelectedContext {
    contextType: ContextType ;
    contextInfo: ContextInfo;
    contextRect: ClientRect;
}

const resolution = {
    height: 860, // 972,
    width: 648,
};

export const AppContext = React.createContext<AppContextProps | null>(null);
type AllProps = Props & StateProps & DispatchProps;

const App = (props: AllProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [selectedContext, setSelectedContext] = useState<SelectedContext>();
    const [containerRect, setContainerRect] = useState<ClientRect>();
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [selectedStructure, setSelectedStructure] = useState<Structure>();
    const [activeWindows, setActiveWindows] = useState<React.ReactElement[]>([]);

    const handleViewButtonClick = () => {
        SoundManager.playSound(Sound.buttonClick);
    };

    const handleResetClick = () => {
        props.persistor.purge();
        (window as any).location.reload();
    };

    // Router elements
    const TownButton = () => (
        <Link to="/town">
            <button onClick={() => handleViewButtonClick()}> {TextManager.get(`common-view-button-town`)} </button>
        </Link>
    );

    const WorldButton = () => (
        <Link to="/world">
            <button onClick={() => handleViewButtonClick()}> {TextManager.get(`common-view-button-world`)} </button>
        </Link>
    );

    const selectStructure = (structure: Structure | null) => {
        if (structure) {
            const displayName = TextManager.getStructureName(structure);

            const window = <StructureDetailsView structure={structure} title={displayName}/>;
            handleWindowOpened(window);
       }
   };

    const renderTownView = () => <RealTownView onStructureClick={selectStructure} />;
    const renderWorldView = () => <RealWorldView/>;

    // A contextual popup showing what you just clicked. Can be an Item
    const renderContextPopup = () => {
        if (!selectedContext) {
            return null;
        }
        const { contextType, contextInfo, contextRect} = selectedContext;

        return (
            <ContextView
                type={contextType}
                info={contextInfo}
                containerRect={containerRect!}
                referenceRect={contextRect}
                placement={Placement.bottom}
            />
        );
    };

    const handleWindowOpened = (window: React.ReactElement) => {
        setActiveWindows([
            ...activeWindows || [],
            window,
        ]);
    };

    /**
     * Closes all windows
     */
    const handleWindowClose = () => {
        setActiveWindows([]);
    };

    /**
     * Closes the top window of the stack
     */
    const handleWindowBack = () => {
        if (activeWindows && activeWindows.length) {
            setActiveWindows(activeWindows.slice(0, -1));
        }
    };
    const renderWindow = (): React.ReactElement | null => {
        if (!activeWindows.length) {
            return null;
        }

        const topWindow = activeWindows[activeWindows.length - 1];
        const commonWindowProps = {
            onClose: handleWindowClose,
            onBack: handleWindowBack,
            backEnabled: activeWindows.length > 1,
            closeEnabled: true,
        };

        const element = React.cloneElement(topWindow, commonWindowProps);
        return element;
    };

    const handleMediaLoadComplete = (mediaItems: MediaItem[]) => {
        const sounds = mediaItems.filter((m) => m.mediaType === MediaType.sound);
        SoundManager.loadMedia(sounds);

        SoundManager.addSounds({
            [Sound.buttonClick]: "sound/fx/button-click.ogg",
            [Sound.error]: "sound/fx/error.ogg",
            // add more sounds here
        });

        setMedia(mediaItems);

        // todo: temporary!
        // const window = <CombatView/>;
        // this.handleWindowOpened(window);
    };

    const handleContextualObjectActivated = (type: ContextType, info: ContextInfo, origin: React.RefObject<any>, originRect: ClientRect) => {
        setSelectedContext({
            contextInfo: info,
            contextType: type,
            contextRect: originRect,
        });
    };

    const handleAppClick = () => {
        if (selectedContext) {
            setSelectedContext(undefined);
        }
    };

    const handleResize = () => {
        if (containerRef.current) {
            if (window.innerHeight < resolution.height) {
                containerRef.current.style.transform = `scale(${window.innerHeight / resolution.height}) translateX(-50%)`;
            } else {
                containerRef.current.style.transform = `scale(1) translateX(-50%)`;
            }
            const parentBox = containerRef.current.getBoundingClientRect();
            setContainerRect(parentBox);
            // this.setState({
            //     containerRect: parentBox,
            //     selectedContext: null, // this would be in the wrong place
            // });
       }
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <AppContext.Provider value={{ media, onContextualObjectActivated: handleContextualObjectActivated, onOpenWindow: handleWindowOpened }} >
            <div
                className="app"
                ref={containerRef}
                style={{
                    width: resolution.width,
                    height: resolution.height,
                }}
                onClick={handleAppClick}
            >
                <DndProvider backend={HTML5Backend}>
                <Router>
                    <Preloader
                        manifest={manifest}
                        onLoadComplete={handleMediaLoadComplete}
                    >
                        <Topbar/>
                        <Redirect from="/" to="world" />
                        <Route path="/world" component={TownButton} />
                        <Route path="/town" component={WorldButton} />
                        {` | `}
                        <button onClick={() => handleResetClick()} style={{ color: "red"}}> Restart! </button>
                        <Route path="/town" component={renderTownView} />
                        <Route path="/world" component={renderWorldView} />
                        <SimpleLog/>
                        {renderWindow()}
                        {renderContextPopup()}
                    </Preloader>
                </Router>
                </DndProvider>
            </div>
        </AppContext.Provider>
    );
};

export default App;
