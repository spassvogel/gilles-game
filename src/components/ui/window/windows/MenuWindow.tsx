import { Props as WindowProps } from "components/ui/window/Window";
import { AppContextProps, withAppContext } from "hoc/withAppContext";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import SettingsWindow from './SettingsWindow';
import CheatWindow from './CheatWindow';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { Persistor } from 'redux-persist';
import { runGame } from 'index';
import configureStore from 'utils/configureStore';
import { useState } from 'react';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { TextManager } from 'global/TextManager';
import { createEncryptor } from 'simple-encryptor';
import "./styles/menu.scss";

// tslint:disable-next-line:no-empty-interface
export interface Props {
    persistor: Persistor;
}

const key = "P5mw}jD>5c6Y]yqy";
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
        const encryptor = createEncryptor(key);
        const a = document.createElement('a');
        const text = JSON.stringify(storeState);
        const encrypted = encryptor.encrypt(text);
        const filename = "Gidletown save.json";
        a.setAttribute('href', 'data:text/json;cccharset=utf-8,' + encodeURIComponent(encrypted));
        a.setAttribute('download', filename);
        a.click();
    }

    const handleClickLoad = () => {
        if (!loadedStore) return;
        const dataToLoad = loadedStore;
        setLoadedStore(undefined);
        props.persistor.purge().then(async () => {
            const { store } = await configureStore(dataToLoad);
            runGame(store);
            ToastManager.addToast(TextManager.get("ui-game-loaded"), Type.game, "/img/items/misc/magic-eye.png");
            props.onCloseWindow();
        });
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const encryptor = createEncryptor(key);
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const encrypted = fileReader.result! as string;
            const text = encryptor.decrypt(encrypted);
            const obj: StoreState = JSON.parse(text);
            setLoadedStore(obj);
        }
        fileReader.readAsText(e.target.files![0]);
    }



    return (
        <div className="menu">
            <p>
                <button onClick={handleClickCheats}>Cheats!</button>
            </p>
            <p>
                <button onClick={handleClickSettings}>Settings</button>
            </p>
            <p>
                <button onClick={handleClickSave}>Save</button>
            </p>
            <p>
                <input type="file" onChange={handleFileChange}/>
                <button onClick={handleClickLoad} disabled={!loadedStore}>Load</button>
            </p>
        </div>
    );
}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
