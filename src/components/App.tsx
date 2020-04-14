// tslint:disable: object-literal-sort-keys
import { ContextInfo, ContextType} from "constants/context";
import CombatView from "containers/combat/CombatView";
import StructureDetailsView from "containers/structures/StructureDetailsView";
import { AppContextProps} from "hoc/withAppContext";
import { manifest} from "manifest/app";
import * as React from "react";
import { useRef, useState, createContext } from "react";
import { DndProvider} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { BrowserRouter as Router, Link, Redirect, Route, Switch, HashRouter} from "react-router-dom";
import { Persistor} from "redux-persist";
import { Sound, SoundManager} from "global/SoundManager";
import { TextManager} from "global/TextManager";
import { Structure} from "../definitions/structures";
import "./css/app.css";
import Preloader, { MediaItem, MediaType} from "./preloading/Preloader";
import TownView from './town/TownView';
import Toasts from './ui/toasts/Toasts';
import Topbar from './ui/topbar/Topbar';
import WorldView from './world/WorldView';
import SimpleLog from './log/SimpleLog';
import ContextTooltip from './ui/tooltip/ContextTooltip';
import { TooltipManager } from 'global/TooltipManager';

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
    width: 480,
};

export const MAX_WIDTH = 960;

export const AppContext = createContext<AppContextProps | null>(null);
type AllProps = Props & StateProps & DispatchProps;


const App = (props: AllProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [media, setMedia] = useState<MediaItem[]>([]);
    const [activeWindows, setActiveWindows] = useState<React.ReactElement[]>([]);

    const handleViewButtonClick = () => {
        SoundManager.playSound(Sound.buttonClick);
    };

    const handleResetClick = () => {
        props.persistor.purge();
        (window as any).location.reload();
    };

    const selectStructure = (structure: Structure | null) => {
        if (structure) {
            const displayName = TextManager.getStructureName(structure);

            const window = <StructureDetailsView structure={structure} title={displayName}/>;
            handleWindowOpened(window);
       }
   };

    const renderTownView = () => <TownView onStructureClick={selectStructure} />;
    const renderWorldView = () => <WorldView/>;

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
        //const window = <CombatView/>;
        //handleWindowOpened(window);
    };

    const handleAppClick = () => {
        TooltipManager.clear();
    };

    // const handleResize = () => {
    //     if (containerRef.current) {
    //         if (window.innerHeight < resolution.height) {
    //            // containerRef.current.style.transform = `scale(${Math.min(window.innerWidth / resolution.width, 1)}) translateX(-50%)`;
    //         } else {
    //             //containerRef.current.style.transform = `scale(1) translateX(-50%)`;
    //         }
    //         //const parentBox = containerRef.current.getBoundingClientRect();
    //         //setContainerRect(parentBox);
    //    }
    // };

    // useEffect(() => {
    //     // todo: see if we can disable this;
    //     window.addEventListener("resize", handleResize);
    //     handleResize();
    //     return () => {
    //         window.removeEventListener("resize", handleResize);
    //     };
    // }, []);

    return (
        <AppContext.Provider value={{ 
            media, 
            onOpenWindow: handleWindowOpened,
        }} >
            <div
                className="app"
                ref={containerRef}
                style={{
                    maxWidth: MAX_WIDTH
                }}
                onClick={handleAppClick}
            >
                <DndProvider backend={HTML5Backend}>
                <HashRouter>
                    <Preloader
                        manifest={manifest}
                        onLoadComplete={handleMediaLoadComplete}
                    >
                        <Topbar/>
                        <div>
                            <Switch>
                                <Route path="/" exact>
                                    <Redirect from="/" to="world" />
                                </Route>
                                <Route path="/world">
                                    <Link to="/town">
                                        <button onClick={() => handleViewButtonClick()}> {TextManager.get(`common-view-button-town`)} </button>
                                    </Link>
                                </Route>
                                <Route path="/town">
                                    <Link to="/world">
                                        <button onClick={() => handleViewButtonClick()}> {TextManager.get(`common-view-button-world`)} </button>
                                    </Link>
                                </Route>
                            </Switch>
                            {` | `}
                            <button data-for="global2" data-tip2 onClick={() => handleResetClick()} style={{ color: "red"}}> Restart! </button>
                        </div>
                        <Switch>
                            <Route path="/town" component={renderTownView} />
                            <Route path="/world" component={renderWorldView} />
                        </Switch>
                        <SimpleLog/>
                        {renderWindow()}
                        <ContextTooltip />    
                        <Toasts />
                    </Preloader>
                </HashRouter>
                </DndProvider>
            </div>
        </AppContext.Provider>
    );
};

export default App;
