import * as React from "react";
import {AppContextProps} from "hoc/withAppContext";
import {useRef, useState, createContext, useEffect } from "react";
import {DndProvider } from "react-dnd";
import {HTML5Backend } from 'react-dnd-html5-backend';
import {Link, Redirect, Route, Switch, HashRouter} from "react-router-dom";
import {Persistor} from "redux-persist";
import {PixiPlugin } from 'gsap/all';
import {gsap } from 'gsap';
import {SoundManager} from "global/SoundManager";
import {TextManager} from "global/TextManager";
import {Structure} from "definitions/structures";
import debounce from "debounce";
import TownView from 'components/town/TownView';
import Toasts from 'components/ui/toasts/Toasts';
import Topbar from 'components/ui/topbar/Topbar';
import WorldView from 'components/world/WorldView';
import SimpleLog from 'components/log/SimpleLog';
import ContextTooltip from 'components/ui/tooltip/ContextTooltip';
import {TooltipManager } from 'global/TooltipManager';
import {getWorldLink, getTownLink } from 'utils/routing';
import Background from 'components/Background';
import { restartGame } from 'index';
import Button, { ButtonColor } from 'components/ui/buttons/Button';
import StructureDetailsView from 'components/town/StructureDetailsView';
import "./styles/app.scss";

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);


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


export const MAX_WIDTH = 960;
export const AppContext = createContext<AppContextProps | null>(null);
type AllProps = Props & StateProps & DispatchProps;


const App = (props: AllProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [activeWindows, setActiveWindows] = useState<React.ReactElement[]>([]);

    const handleViewButtonClick = () => {
        SoundManager.playSound("ui/buttonClick");
    };

    const handleRestartClick = () => {
        restartGame();

    };

    const selectStructure = (structure: Structure | null) => {
        if (structure) {
            const displayName = TextManager.getStructureName(structure);

            const window = <StructureDetailsView structure={structure} title={displayName} />;
            handleWindowOpened(window);

            SoundManager.playSound("ui/buttonClick");
       }
    };

    const renderTownView = () => <TownView onStructureClick={selectStructure} />;
    const renderWorldView = () => <WorldView />;

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

    useEffect(() => {
        SoundManager.addSound("ui/buttonClick", "sound/fx/button-click.ogg");
        SoundManager.addSound("ui/error", "sound/fx/error.ogg");
        SoundManager.addSound("ui/toast", "sound/fx/toast.ogg");
    }, []);

    const handleAppClick = () => {
        TooltipManager.clear();
    };

    useEffect(() => {
        const handleScroll = debounce(() => {
            TooltipManager.clear();
        }, 100);
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("wheel", handleScroll);
        return () => {
            window.removeEventListener("resize", handleScroll);
            window.removeEventListener("wheel", handleScroll);
        };
    }, []);

    return (
        <AppContext.Provider value={{
            onOpenWindow: handleWindowOpened,
            onCloseWindow: handleWindowClose,
        }} >
            <Background />
            <div
                className="app"
                ref={containerRef}
                style={{
                    maxWidth: MAX_WIDTH
                }}
                onClick={handleAppClick}
            >
                {/* <QuestRepaintTester /> */}
                <DndProvider backend={HTML5Backend}>
                <HashRouter>
                    <Topbar persistor={props.persistor} />
                    <div className="control-bar">
                        <Switch>
                            <Route path="/" exact={true} >
                                <Redirect from="/" to={getWorldLink()} />
                            </Route>
                            <Route path={getWorldLink()}>
                                <Link to={getTownLink()}>
                                    <Button onClick={() => handleViewButtonClick()} color="green"> {TextManager.get(`ui-view-button-town`)} </Button>
                                </Link>
                            </Route>
                            <Route path={getTownLink()}>
                                <Link to={getWorldLink()}>
                                    <Button onClick={() => handleViewButtonClick()}  > {TextManager.get(`ui-view-button-world`)} </Button>
                                </Link>
                            </Route>
                        </Switch>
                        {` | `}
                        <Button onClick={() => handleRestartClick()} color={ButtonColor.purple} > Restart! </Button>
                    </div>
                    <Switch>
                        <Route path={getTownLink()} render={renderTownView} />
                        <Route path={getWorldLink()} render={renderWorldView} />
                    </Switch>
                    <SimpleLog/>
                    {renderWindow()}
                    <ContextTooltip />
                    <Toasts />
                </HashRouter>
                </DndProvider>
            </div>
        </AppContext.Provider>
    );
};

export default App;
