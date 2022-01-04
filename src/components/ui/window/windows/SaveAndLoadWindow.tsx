import { Props as WindowProps } from "components/ui/window/Window";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import { compose } from "redux";
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import * as Version from "constants/version";
import {  useState } from 'react';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { decryptSavedGame, saveGame } from "utils/game";
import GameStats from "components/ui/game/GameStats";
import LoadingSpinner from "components/ui/loading/LoadingSpinner";
import { loadGame } from "store/actions/game";
import { convertIntToSemVer } from "utils/version";
import "./styles/saveAndLoad.scss";


type AllProps = WindowProps;
const SaveAndLoad = (props: AllProps & AppContextProps) => {
  const storeState = useSelector<StoreState, StoreState>(state => state);
  const [loadedStore, setLoadedStore] = useState<StoreState>();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleClickSave = () => {
     saveGame(storeState);
  }

  const handleClickLoad = async () => {
    if (!loadedStore) return;

    // If we're loading a game made with an older version, inform the user
    const gameVersion = loadedStore.game?.version;
    if (gameVersion < Version.asInt && loadedStore.game?.ignoreVersionDiff !== Version.asInt) {
      if (!window.confirm(`This game was initialized with version ${convertIntToSemVer(gameVersion)} which is older than the current client (${Version.default}). This might cause problems. Continue anyway? \n\n `)) {
        return
      }
      loadedStore.game.ignoreVersionDiff = Version.asInt;
    }

    setLoading(true);
    setLoadedStore(undefined);

    dispatch(loadGame(loadedStore));
    ToastManager.addToast(TextManager.get("ui-game-loaded"), Type.game, "/img/items/misc/magic-eye.png");
    props.onCloseWindow();

  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const encrypted = fileReader.result as string;
      const state =  decryptSavedGame(encrypted)

      setLoadedStore(state);
    }
    if (e.target.files){
      fileReader.readAsText(e.target.files[0]);
    }
  }

  return (
    <div className="save-and-load">
      <section>
        Save game to disk:&nbsp;
        <Button onClick={handleClickSave}>Save</Button>
      </section>
      <section>
        Load game from disk:&nbsp;
        <input type="file" onChange={handleFileChange} accept=".json" />
        <Button onClick={handleClickLoad} disabled={!loadedStore}>Load</Button>
      </section>
      <div>
        { loading && <LoadingSpinner /> }
        { loadedStore && <GameStats state={loadedStore} />}
      </div>
    </div>
  );
}

export default compose(
  withWindow,
  withAppContext,
)(SaveAndLoad) as React.ComponentType<AllProps>;
