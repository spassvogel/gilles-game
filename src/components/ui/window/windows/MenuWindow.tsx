import { useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import Button from 'components/ui/buttons/Button'
import GameStats from 'components/ui/game/GameStats'
import { useContext } from 'react'
import { appContext } from 'components/App/context'
import * as TextManager from 'global/TextManager'
import CheatWindow from './CheatWindow'
import SettingsWindow from './SettingsWindow'
import SaveAndLoadWindow from './SaveAndLoadWindow'
import Window from '../Window'

import './styles/menu.scss'

const Menu = () => {
  const app = useContext(appContext)

  const storeState = useSelector<StoreState, StoreState>(state => state)

  const handleClickCheats = () => {
    const window = <CheatWindow />
    app?.onOpenWindow(window)
  }

  const handleClickSettings = () => {
    const window = <SettingsWindow />
    app?.onOpenWindow(window)
  }

  const handleClickSaveAndLoad = () => {
    const window = <SaveAndLoadWindow />
    app?.onOpenWindow(window)
  }

  return (
    <Window title={TextManager.get('ui-window-title-menu')}>
      <div className="menu">
        <p>
          <Button onClick={handleClickSaveAndLoad}>Save and load</Button>
        </p>
        <p>
          <Button onClick={handleClickCheats}>Cheats!</Button>
        </p>
        <p>
          <Button onClick={handleClickSettings}>Settings</Button>
        </p>
        <div>
          <GameStats state={storeState} />
        </div>
      </div>
    </Window>
  )
}

export default Menu
