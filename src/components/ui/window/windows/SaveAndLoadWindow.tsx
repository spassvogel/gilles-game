import { Props as WindowProps } from "components/ui/window/Window";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { loadGame } from 'index';
import { useState } from 'react';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { decryptSavedGame, saveGame } from "utils/game";
import GameStats from "components/ui/game/GameStats";
import "./styles/saveAndLoad.scss";


type AllProps = WindowProps;
const SaveAndLoad = (props: AllProps & AppContextProps) => {

  const storeState = useSelector<StoreState, StoreState>(state => state);
  const [loadedStore, setLoadedStore] = useState<StoreState>();

  const handleClickSave = () => {
     saveGame(storeState);
  }

  const handleClickLoad = async () => {
    if (!loadedStore) return;

    setLoadedStore(undefined);

    await loadGame(loadedStore);
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
        <input type="file" onChange={handleFileChange} />
        <Button onClick={handleClickLoad} disabled={!loadedStore}>Load</Button>
      </section>
      <div>
        { loadedStore && <GameStats state={loadedStore} />}
      </div>
    </div>
  );
}

export default compose(
  withWindow,
  withAppContext,
)(SaveAndLoad) as React.ComponentType<AllProps>;
