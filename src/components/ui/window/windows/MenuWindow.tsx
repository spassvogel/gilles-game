import { Props as WindowProps } from "components/ui/window/Window";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import SettingsWindow from './SettingsWindow';
import CheatWindow from './CheatWindow';
import { useSelector } from 'react-redux';
import { StoreState } from 'store/types';
import { Persistor } from 'redux-persist';
import { loadGame } from 'index';
import { useState } from 'react';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { TextManager } from 'global/TextManager';
import Button from 'components/ui/buttons/Button';
import { decryptSavedGame, saveGame } from "utils/game";
import "./styles/menu.scss";

// tslint:disable-next-line:no-empty-interface
export interface Props {
    persistor: Persistor;
}

type AllProps = Props & WindowProps;
const Menu = (props: AllProps & AppContextProps) => {

    const storeState = useSelector<StoreState>(state => state);
    const [loadedStore, setLoadedStore] = useState<StoreState>();

    const handleClickCheats = () => {
        const window = <CheatWindow title="Cheats" />;
        props.onOpenWindow(window);
    };

    const handleClickSettings = () => {
        const window = <SettingsWindow title="Settings" />;
        props.onOpenWindow(window);
    };

    const handleClickSave = () => {
       saveGame(storeState as StoreState);
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
            const encrypted = fileReader.result! as string;
            const state =  decryptSavedGame(encrypted)

            setLoadedStore(state);
        }
        fileReader.readAsText(e.target.files![0]);
    }



    return (
        <div className="menu">
            <p>
                <Button onClick={handleClickCheats}>Cheats!</Button>
            </p>
            <p>
                <Button onClick={handleClickSettings}>Settings</Button>
            </p>
            <fieldset>
                <legend>Save and load</legend>
                <section>
                    Save game to disk:&nbsp;
                    <Button onClick={handleClickSave}>Save</Button>
                </section>
                <section>
                    Load game from disk:&nbsp;
                    <input type="file" onChange={handleFileChange} />
                    <Button onClick={handleClickLoad} disabled={!loadedStore}>Load</Button>
                </section>
            </fieldset>
        </div>
    );
}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
