import * as React from "react";
import { compose } from "redux";
import { ChangeEvent } from 'react';
import gsap from 'gsap';
import { Channel, SoundManager } from 'global/SoundManager';
import { withWindow } from "hoc/withWindow";
import "./styles/settings.scss";

const SettingsWindow = () => {

    const getChannelControls = (channel: Channel) => {
        const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
            const linear = parseFloat(e.target.value);
            const log = Math.pow(linear, 2);
            SoundManager.setChannelVolume(channel, log);
        };
        const handleMuteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            const slider = (e.currentTarget as HTMLButtonElement).parentNode!.lastChild;
            gsap.to(slider, {
                duration: .5,
                value: 0,
                onComplete: () => {
                    SoundManager.setChannelVolume(channel, 0);
                }
            });
        }

        return (
            <p>
                <label>{Channel[channel]}</label>
                <button onClick={handleMuteClick}>
                    <span role="img" aria-label="Mute">🔇</span>
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    onChange={handleVolumeChange}
                    defaultValue={`${Math.sqrt(SoundManager.getChannelVolume(channel))}`}
                />
            </p>
        )
    }

    return (
        <div className="settings-window">
            <details open = { true } className="sound" >
                <summary>Sound volume</summary>
                <section>
                    {getChannelControls(Channel.ui)}
                    {getChannelControls(Channel.scene)}
                    {getChannelControls(Channel.music)}
                </section>
            </details>
        </div>
    );
}

export default compose(
    withWindow,
)(SettingsWindow);
