import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { compose } from "redux";
import "./css/settingswindow.css";
import { ChangeEvent, useRef } from 'react';
import { SoundManager } from 'global/SoundManager';
import gsap from 'gsap';

const SettingsWindow = () => {

    const soundSlider = useRef<HTMLInputElement>(null);
    const musicSlider = useRef<HTMLInputElement>(null);

    const handleSoundMuteClick = () => {
        gsap.to(soundSlider.current, {
            duration: .5,
            value: 0,
            onComplete: () => {
                SoundManager.soundVolume = 0;
            }
        });
    }
    const handleMusicMuteClick = () => {
        gsap.to(musicSlider.current, {
            duration: .5,
            value: 0,
            onComplete: () => {
                SoundManager.musicVolume = 0;
            }
        });
    }

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
            <details open = { true } className="sound" >
                <summary>Sound</summary>
                <section>
                    <p>
                        <label>Sound</label>
                        <button onClick={handleSoundMuteClick}>
                            <span role="img" aria-label="Mute">🔇</span>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            ref={soundSlider}
                            onChange={handleSoundChange}
                            defaultValue={`${Math.sqrt(SoundManager.soundVolume)}`}
                        />
                    </p>
                    <p>
                        <label>Music</label>
                        <button onClick={handleMusicMuteClick}>
                            <span role="img" aria-label="Mute">🔇</span>
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            ref={musicSlider}
                            onChange={handleMusicChange}
                            defaultValue={`${Math.sqrt(SoundManager.musicVolume)}`}
                        />
                    </p>
                </section>
            </details>
        </div>
    );
}

export default compose(
    withWindow,
)(SettingsWindow);
