import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import Button, { ButtonColor } from 'components/ui/buttons/Button'
import GameStats from 'components/ui/game/GameStats'
import { useContext } from 'react'
import { appContext } from 'components/App/context'
import * as TextManager from 'global/TextManager'
import CheatWindow from './CheatWindow'
import SettingsWindow from './SettingsWindow'
import SaveAndLoadWindow from './SaveAndLoadWindow'
import Window from '../Window'
import { GameActionsContext } from 'components/Game/context'

import './styles/menu.scss'

const Menu = () => {
  const app = useContext(appContext)
  const { restartGame } = useContext(GameActionsContext)

  const storeState = useSelector<StoreState, StoreState>(state => state)

  const handleClickCheats = () => {
    const window = <CheatWindow key="cheat"/>
    app?.onOpenWindow(window)
  }

  const handleClickSettings = () => {
    const window = <SettingsWindow key="settings"/>
    app?.onOpenWindow(window)
  }

  const handleClickSaveAndLoad = () => {
    const window = <SaveAndLoadWindow key="saveandload"/>
    app?.onOpenWindow(window)
  }

  const handleRestartClick = () => {
    restartGame()
  }

  return (
    <Window title={TextManager.get('ui-window-title-menu')}>
      <div className="menu">
        <div className="buttons">
          <Button onClick={handleClickSaveAndLoad} size="medium">Save and load</Button>
          <Button onClick={handleClickCheats} size="medium">Cheats!</Button>
          <Button onClick={handleClickSettings} size="medium">Settings</Button>
          <Button onClick={handleRestartClick} size="medium" color={ButtonColor.purple} > Restart! </Button>
        </div>

        <div>
          <GameStats state={storeState} />
        </div>
      </div>
    </Window>
  )
}

export default Menu
