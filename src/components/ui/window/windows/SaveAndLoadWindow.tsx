import { useDispatch, useSelector } from 'react-redux'
import { type StoreState } from 'store/types'
import version from 'constants/version'
import { useContext, useState } from 'react'
import { ToastEmitter } from 'emitters/ToastEmitter'
import { Type } from 'components/ui/toasts/Toast'
import * as TextManager from 'global/TextManager'
import Button from 'components/ui/buttons/Button'
import { decryptSavedGame, saveGame } from 'utils/game'
import GameStats from 'components/ui/game/GameStats'
import LoadingSpinner from 'components/ui/loading/LoadingSpinner'
import { loadGame } from 'store/actions/game'
import { asInt, convertIntToSemVer } from 'utils/version'
import { appContext } from 'components/App/context'
import Window from '../Window'

import './styles/saveAndLoad.scss'

const SaveAndLoadWindow = () => {
  const storeState = useSelector<StoreState, StoreState>(state => state)
  const [loadedStore, setLoadedStore] = useState<StoreState>()
  const [loading, setLoading] = useState(false)
  const app = useContext(appContext)

  const dispatch = useDispatch()

  const handleClickSave = () => {
    void saveGame(storeState)
  }

  const handleClickLoad = () => {
    if (loadedStore == null) return

    // If we're loading a game made with an older version, inform the user
    const gameVersion = loadedStore.game?.version
    if (gameVersion < asInt && loadedStore.game?.ignoreVersionDiff !== asInt) {
      if (!window.confirm(`This game was initialized with version ${convertIntToSemVer(gameVersion)} which is older than the current client (${version}). This might cause problems. Continue anyway? \n\n `)) {
        return
      }
      loadedStore.game.ignoreVersionDiff = asInt
    }

    setLoading(true)
    setLoadedStore(undefined)

    dispatch(loadGame(loadedStore))
    ToastEmitter.addToast(TextManager.get('ui-game-loaded'), Type.game, 'img/items/misc/magic-eye.png')
    app?.onCloseWindow()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader()
    fileReader.onload = async () => {
      const encrypted = fileReader.result as string
      const state = await decryptSavedGame(encrypted)

      setLoadedStore(state)
    }
    if (e.target.files != null) {
      fileReader.readAsText(e.target.files[0])
    }
  }

  return (
    <Window title={TextManager.get('ui-window-title-save-and-load')}>
      <div className="save-and-load">
        <section>
          Save game to disk:
          <Button onClick={handleClickSave} className="save-button">Save</Button>
        </section>
        <section>
          Load game from disk:
          <input type="file" onChange={handleFileChange} accept=".json" />
          <Button onClick={handleClickLoad} disabled={loadedStore == null}>Load</Button>
        </section>
        <div>
          { loading && <LoadingSpinner /> }
          { (loadedStore != null) && <GameStats state={loadedStore} loadGameMode />}
        </div>
      </div>
    </Window>
  )
}

export default SaveAndLoadWindow
