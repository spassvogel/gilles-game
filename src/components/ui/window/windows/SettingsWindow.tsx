import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/settingswindow.css";
import { ChangeEvent } from 'react';
import { SoundManager } from 'global/SoundManager';

const SettingsWindow = () => {

    const handleSoundChange = (e: ChangeEvent<HTMLInputElement>) => {
        const linear = parseFloat(e.target.value);
        const log = Math.pow(linear, 2);
        SoundManager.soundVolume = log;
    };

    const handleMusicChange = (e: ChangeEvent<HTMLInputElement>) => {
        const linear = parseFloat(e.target.value);
        const log = Math.pow(linear, 2);
        SoundManager.musicVolume = log;
    };

    return (
        <div className="settings-window">
            <details open = { true } >
                <summary>Sound</summary>
                <section>
                    <p>
                        <label>Sound</label>
                        <input type="range" min="0" max="1" step="0.05" onChange={handleSoundChange} defaultValue={`${Math.sqrt(SoundManager.soundVolume)}`} />
                    </p>
                    <p>
                        <label>Music</label>
                        <input type="range" min="0" max="1" step="0.05" onChange={handleMusicChange} defaultValue={`${Math.sqrt(SoundManager.musicVolume)}`} />
                    </p>
                </section>
            </details>
        </div>
    );
}

export default compose(
    withWindow,
)(SettingsWindow);
