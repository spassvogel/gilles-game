import * as PIXI from 'pixi.js';
import { AppContextProps } from 'hoc/withAppContext';
import { useRef, useState, createContext, useEffect, useContext, ReactElement, cloneElement } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link, Redirect, Route, Switch, HashRouter } from 'react-router-dom';
import { PixiPlugin } from 'gsap/all';
import { gsap } from 'gsap';
import { SoundManager } from 'global/SoundManager';
import { TextManager } from 'global/TextManager';
import debounce from 'debounce';
import TownView from 'components/town/TownView';
import Toasts from 'components/ui/toasts/Toasts';
import Topbar from 'components/ui/topbar/Topbar';
import WorldView from 'components/world/WorldView';
import SimpleLog from 'components/log/SimpleLog';
import ContextTooltip from 'components/ui/tooltip/ContextTooltip';
import { TooltipManager } from 'global/TooltipManager';
import { getWorldLink, getTownLink } from 'utils/routing';
import Button, { ButtonColor } from 'components/ui/buttons/Button';
import Bubbles from 'components/ui/bubbles/Bubbles';
import { BubbleLayer } from 'global/BubbleManager';
import { GameActionsContext } from 'components/Game/context';
import { useSettings } from 'hooks/store/settings';
import DebugDrawer from 'components/debug/DebugDrawer';
import './styles/app.scss';

PixiPlugin.registerPIXI(PIXI);
gsap.registerPlugin(PixiPlugin);


declare global {
  interface Window { __PIXI_INSPECTOR_GLOBAL_HOOK__: { register: (x: { PIXI: typeof PIXI }) => void }; }
}
if (process.env.NODE_ENV === 'development') {
  // Register pixi inspector chrome plugin
  // https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__?.register({ PIXI: PIXI });
}

export enum View {
  Town,
  World,
}

export const MAX_WIDTH = 960;
export const AppContext = createContext<AppContextProps | null>(null);


const App = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { restartGame } = useContext(GameActionsContext);
  const [activeWindows, setActiveWindows] = useState<ReactElement[]>([]);

  const handleViewButtonClick = () => {
    SoundManager.playSound('ui/buttonClick');
  };

  const handleRestartClick = () => {
    restartGame();
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

  const renderWindow = (): ReactElement | null => {
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

    const element = cloneElement(topWindow, commonWindowProps);
    return element;
  };

  useEffect(() => {
    SoundManager.addSound('ui/buttonClick', 'sound/ui/button-click.ogg');
    SoundManager.addSound('ui/equip', 'sound/ui/equip.mp3');
    SoundManager.addSound('ui/error', 'sound/ui/error.ogg');
    SoundManager.addSound('ui/levelUp', 'sound/ui/level-up.ogg');
    SoundManager.addSound('ui/toast', 'sound/ui/toast.ogg');

    SoundManager.addSound('scene/drinking', 'sound/scene/drinking.ogg');
  }, []);

  const settings = useSettings();

  const handleAppClick = () => {
    TooltipManager.clear();
  };

  useEffect(() => {
    const handleScroll = debounce(() => {
      TooltipManager.clear();
    }, 100);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);

  return (
    <AppContext.Provider value={{
      onOpenWindow: handleWindowOpened,
      onCloseWindow: handleWindowClose,
    }} >
      <div
        className="app"
        ref={containerRef}
        style={{
          maxWidth: MAX_WIDTH,
        }}
        onClick={handleAppClick}
      >
        {/* <QuestRepaintTester /> */}
        <DndProvider backend={HTML5Backend}>
        <HashRouter>
          <Topbar />
          <div className="control-bar">
            <Switch>
              <Route path="/" exact={true} >
                <Redirect from="/" to={getWorldLink()} />
              </Route>
              <Route path={getWorldLink()}>
                <Link to={getTownLink()}>
                  <Button onClick={() => handleViewButtonClick()} color="green"> {TextManager.get('ui-view-button-town')} </Button>
                </Link>
              </Route>
              <Route path={getTownLink()}>
                <Link to={getWorldLink()}>
                  <Button onClick={() => handleViewButtonClick()}> {TextManager.get('ui-view-button-world')} </Button>
                </Link>
              </Route>
            </Switch>
            {' | '}
            <Button onClick={() => handleRestartClick()} color={ButtonColor.purple} > Restart! </Button>
          </div>
          <Switch>
            <Route path={getTownLink()} >
              <TownView />
            </Route>
            <Route path={getWorldLink()} >
              <WorldView />
            </Route>
          </Switch>
          <SimpleLog/>
          {renderWindow()}
          <ContextTooltip />
          <Toasts />
          <Bubbles layer={BubbleLayer.general} />
          <DebugDrawer />
        </HashRouter>
        </DndProvider>
      </div>
    </AppContext.Provider>
  );
};

export default App;
