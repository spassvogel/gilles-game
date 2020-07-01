import { Props as WindowProps } from "components/ui/window/Window";
import CheatWindow from "containers/windows/CheatWindow";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/settingswindow.css";
import { ChangeEvent } from 'react';
import { SoundManager } from 'global/SoundManager';

export interface DispatchProps {
}

export interface StateProps {
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
}

type AllProps = Props & StateProps & DispatchProps & WindowProps;
const SettingsWindow = (props: AllProps) => {

    const handleMusicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const linear = parseFloat(e.target.value);
        const log = Math.pow(linear, 2);
        SoundManager.musicVolume = log;
    };
    return (
        <div className="settings-window">
            <details open = { true } className="sound" >
                <summary>Sound</summary>
                <section>
                    <p>
                        <label>Music</label>
                        🔇 
                        <input type="range" min="0" max="1" step="0.05" onChange={handleMusicChange} defaultValue={`${Math.sqrt(SoundManager.musicVolume)}`} />
                    </p>
                    <p>
                        <label>Sound</label>
                        🔇 
                        <input type="range" min="0" max="1" step="0.1" />
                    </p>
                </section>
            </details>
        </div>
    );
}

export default compose(
    withWindow,
)(SettingsWindow) as React.ComponentType<AllProps>;
