import * as React from 'react'
import { useDispatch } from 'react-redux'
import { type ChangeEvent } from 'react'
import gsap from 'gsap'
import { Channel, SoundManager } from 'global/SoundManager'
import { setSetting, type SettingsKey } from 'store/actions/settings'
import { useSettings } from 'hooks/store/settings'
import Window from '../Window'
import * as TextManager from 'global/TextManager'

import './styles/settings.scss'
import { languages } from 'constants/languages'

const SettingsWindow = () => {
  const settings = useSettings()
  const dispatch = useDispatch()

  const getChannelControls = (channel: Channel) => {
    const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
      const linear = parseFloat(e.target.value)
      const log = Math.pow(linear, 2)
      SoundManager.setChannelVolume(channel, log)
    }

    const handleMuteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const slider = (e.currentTarget as HTMLButtonElement).parentNode?.lastChild
      if (slider != null) {
        gsap.to(slider, {
          duration: 0.5,
          value: 0,
          onComplete: () => {
            SoundManager.setChannelVolume(channel, 0)
          }
        })
      }
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

  const handleBooleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.currentTarget.getAttribute('setting-name')
    if (setting === null) throw new Error('No setting')
    if (setting.includes('debug.')) {
      const newSettings = {
        ...settings.debug,
        [setting.replace('debug.', '')]: e.currentTarget.checked
      }
      dispatch(setSetting('debug', newSettings))
    } else {
      dispatch(setSetting(setting as SettingsKey, e.currentTarget.checked))
    }
  }

  const handleStringChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const setting = e.currentTarget.getAttribute('setting-name')
    if (setting === null) throw new Error('No setting')

    dispatch(setSetting(setting as SettingsKey, e.currentTarget.value))
  }
  return (
    <Window title={TextManager.get('ui-window-title-settings')}>
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
            <label>Enable debug drawer (~ key)</label>
            <input
              type="checkbox"
              checked={settings.debug.enableDebugDrawer}
              setting-name="debug.enableDebugDrawer"
              onChange={handleBooleanChange}
            />
          </p>
          </section>

        </details>
        <details open className="settings-section language" >
          <summary>Language</summary>
          <section>
            <p>
            <label>Language</label>
            <select
              value={settings.language}
              onChange={handleStringChange}
              setting-name="language"
>
              {languages.map((l) => (<option key={l}>{l}</option>))}
            </select>
          </p>
          </section>

        </details>
      </div>
    </Window>
  )
}

export default SettingsWindow
