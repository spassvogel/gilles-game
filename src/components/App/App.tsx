import * as PIXI from 'pixi.js'
import { PixiPlugin } from 'gsap/all'
import { gsap } from 'gsap'
import { AppContextProvider } from './context'
import { type ReactElement, useCallback, useState, useRef, useContext } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { HashRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import { getTownLink, getWorldLink } from 'utils/routing'
import * as TextManager from 'global/TextManager'
import Button, { ButtonColor } from 'components/ui/buttons/Button'
import TownView from 'components/town/TownView'
import Topbar from 'components/ui/topbar'
import SimpleLog from 'components/ui/log/SimpleLog'
import Toasts from 'components/ui/toasts/Toasts'
import Bubbles from 'components/ui/bubbles/Bubbles'
import { BubbleLayer } from 'global/BubbleManager'
import { TooltipManager } from 'global/TooltipManager'
import ContextTooltip from 'components/ui/tooltip/ContextTooltip'
import WorldView from 'components/world/WorldView'
import { GameActionsContext } from 'components/Game/context'

// todo: actually import these as bundles?
import 'definitions/quests/kill10Boars/encounters/dungeon'

import './styles/app.scss'
import DebugDrawer from 'components/debug/DebugDrawer'
import { SoundManager } from 'global/SoundManager'

PixiPlugin.registerPIXI(PIXI)
gsap.registerPlugin(PixiPlugin)

export const MAX_WIDTH = 960

const App = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { restartGame } = useContext(GameActionsContext)
  const [activeWindows, setActiveWindows] = useState<ReactElement[]>([])
  const handleWindowOpened = useCallback((window: React.ReactElement) => {
    setActiveWindows((aW) => [
      ...aW ?? [],
      window
    ])
  }, [])

  const handleViewButtonClick = () => {
    void SoundManager.playSound('UI_BUTTON_CLICK')
  }

  const handleRestartClick = () => {
    restartGame()
  }

  /**
   * Closes top window
   */
  const handleWindowBack = useCallback(() => {
    setActiveWindows((aW) => {
      if (aW.length < 2) {
        return []
      }
      return aW.slice(0, aW.length - 1)
    })
  }, [])

  /**
   * Closes all windows
   */
  const handleWindowClose = useCallback(() => {
    setActiveWindows([])
  }, [])

  const handleAppClick = () => {
    TooltipManager.clear()
  }

  return (
    <AppContextProvider value={{
      windowCount: activeWindows.length,
      onOpenWindow: handleWindowOpened,
      onBackWindow: handleWindowBack,
      onCloseWindow: handleWindowClose
    }}>
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
            <Topbar />
            <div className="control-bar">
              <Routes>
                <Route path="/" element={(
                  <Navigate to={getWorldLink()} />
                )}>
                </Route>
                <Route path={`${getWorldLink()}/*`} element={(
                  <Link to={getTownLink()}>
                    <Button onClick={handleViewButtonClick} color="green"> {TextManager.get('ui-view-button-town')} </Button>
                  </Link>)}
                />
                <Route path={`${getTownLink()}/*`} element={(
                  <Link to={getWorldLink()}>
                    <Button onClick={handleViewButtonClick} color="green"> {TextManager.get('ui-view-button-world')} </Button>
                  </Link>)}
                />
              </Routes>
              {' | '}
              <Button onClick={handleRestartClick} color={ButtonColor.purple} > Restart! </Button>
            </div>
            <Routes>
              <Route path={`${getTownLink()}/*`} element={(<TownView />)} />
              <Route path={`${getWorldLink()}/*`} element={(<WorldView />)} />
            </Routes>
            <SimpleLog/>
            {activeWindows}
            <DebugDrawer />
            <ContextTooltip />
            <Toasts />
            <Bubbles layer={BubbleLayer.general} />
          </HashRouter>
        </DndProvider>
      </div>
    </AppContextProvider>
  )
}

export default App
