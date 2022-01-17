import * as React from 'react';
import { compose } from 'redux';
import { useDispatch } from 'react-redux';
import { ChangeEvent } from 'react';
import gsap from 'gsap';
import { Channel, SoundManager } from 'global/SoundManager';
import { withWindow } from 'hoc/withWindow';
import { setSetting, SettingsKey } from 'store/actions/settings';
import { useSettings } from 'hooks/store/settings';
import './styles/settings.scss';

const SettingsWindow = () => {
  const settings = useSettings();
  const dispatch = useDispatch();

  const getChannelControls = (channel: Channel) => {
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
      const linear = parseFloat(e.target.value);
      const log = Math.pow(linear, 2);
      SoundManager.setChannelVolume(channel, log);
    };

    const handleMuteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const slider = (e.currentTarget as HTMLButtonElement).parentNode?.lastChild;
      if (slider) {
        gsap.to(slider, {
          duration: .5,
          value: 0,
          onComplete: () => {
            SoundManager.setChannelVolume(channel, 0);
          },
        });
      }
    };

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
    );
  };

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.currentTarget.getAttribute('setting-name');
    if (setting === null) throw new Error('No setting');
    dispatch(setSetting(setting as SettingsKey, e.currentTarget.checked));
  };

  return (
    <div className="settings-window">
      <details open className="settings-section sound" >
        <summary>Sound volume</summary>
        <section>
          {getChannelControls(Channel.ui)}
          {getChannelControls(Channel.scene)}
          {getChannelControls(Channel.music)}
          {getChannelControls(Channel.ambient)}
        </section>
      </details>
      <details open className="settings-section combat" >
        <summary>Combat</summary>
        <section>
          <p>
          <label>Verbose combat log</label>
          <input
            type="checkbox"
            checked={settings.verboseCombatLog}
            setting-name="verboseCombatLog"
            onChange={handleBooleanChange}
          />
        </p>
        </section>
      </details>
      <details open className="settings-section debug" >
        <summary>Debug</summary>
        <section>
          <p>
          <label>Allow adventurer stats edit</label>
          <input
            type="checkbox"
            checked={settings.debugAllowAdventurerEdit}
            setting-name="debugAllowAdventurerEdit"
            onChange={handleBooleanChange}
          />
        </p>
        </section>
        <section>
          <p>
          <label>Show debug info menu</label>
          <input
            type="checkbox"
            checked={settings.debugShowDebugMenu}
            setting-name="debugShowDebugMenu"
            onChange={handleBooleanChange}
          />
        </p>
        </section>
        <section>
          <p>
          <label>Show pathable tiles in scene</label>
          <input
            type="checkbox"
            checked={settings.debugSceneShowPathable}
            setting-name="debugSceneShowPathable"
            onChange={handleBooleanChange}
          />
        </p>
        </section>
        <section>
          <p>
          <label>Show action queue tiles in scene</label>
          <input
            type="checkbox"
            checked={settings.debugSceneShowActionQueue}
            setting-name="debugSceneShowActionQueue"
            onChange={handleBooleanChange}
          />
        </p>
        </section>
      </details>
    </div>
  );
};

export default compose(
  withWindow,
)(SettingsWindow);
