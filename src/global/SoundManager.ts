/* eslint-disable @typescript-eslint/no-dynamic-delete */
import localforage from 'localforage'
import { type Sound, type IMediaInstance, filters } from '@pixi/sound'
import { gsap } from 'gsap'
import { Assets } from 'pixi.js'
import { sounds } from 'manifests/sounds'
import { defineAssetPath } from 'utils/assets'

export enum Channel {
  music,
  ui,
  scene,
  ambient,
}

export enum MixMode {
  singleInstance, // Only one sound plays at the same time in this channel
  layered, // Multiple sounds can play in this channel
  fade, // Fades out currently playing sound on this channel and fades new music in
}

export enum Music {
  town,
  world,
}

export type GameSound = keyof typeof sounds

type SoundInfo = {
  instance: IMediaInstance
  gameSound: GameSound
  pixiSound: Sound
  storePosition?: boolean
}

const DEFAULT_MUSIC_VOLUME = 0
const DEFAULT_UI_VOLUME = 1
const DEFAULT_SCENE_VOLUME = 1
const DEFAULT_AMBIENT_VOLUME = 0.2
const STORAGE_KEY_VOLUME = 'channelVolume'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SoundManager {
  private static _currentSound: Record<number, SoundInfo> = {} // per channel

  private static _storedPositions: Record<string, number> = {}

  private static _channelVolume: Record<number, number> = {}

  private static _initialized = false

  private static readonly _filter = new filters.TelephoneFilter()

  public static async init () {
    // Attempt to fetch volumes from storage. If not set, revert to defaults
    this._channelVolume = {
      [(Channel.music)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.music}`) ?? DEFAULT_MUSIC_VOLUME,
      [(Channel.ui)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.ui}`) ?? DEFAULT_UI_VOLUME,
      [(Channel.scene)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.scene}`) ?? DEFAULT_SCENE_VOLUME,
      [(Channel.ambient)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.ambient}`) ?? DEFAULT_AMBIENT_VOLUME
    }
    this._initialized = true
  }

  /**
   * Plays a sound. The sound needs to be loaded through `addSound` first!
   * @param gameSound the GameSound to play
   * @param channel channel to play the sound on
   * @param loop true to make the sound repeat
   * @param mixMode how to mix in the new sound into the channel
   * @param storePosition Store position of current sound on this channel in order to resume
   */
  public static async playSound (gameSound: GameSound, channel: Channel = Channel.ui, loop = false, mixMode: MixMode = MixMode.singleInstance, storePosition = false) {
    if (!this._initialized) {
      await this.init()
    }

    try {
      const pixiSound = this.getSound(gameSound)
      if (pixiSound == null) {
        console.warn(`Can't find sound ${gameSound}`)
      }
      pixiSound.volume = this._channelVolume[channel]
      pixiSound.loop = loop

      if (this._currentSound[channel]?.storePosition === true) {
        // Did we have to store the position of the current sound?
        const oldSoundInfo = this._currentSound[channel]
        oldSoundInfo.instance.once('progress', (progress: number, duration: number) => {
          this._storedPositions[oldSoundInfo.gameSound] = progress * duration
        })
      }
      const start = this._storedPositions[gameSound] ?? 0

      const instance = await pixiSound.play({ start })

      if (this._currentSound[channel] != null) {
        if (mixMode === MixMode.fade) {
        // Fade out current sound on this channel and fade in new sound
          SoundManager.fadeOutSound(channel)
          // Fade in the new sound
          gsap.from(instance, { volume: 0, duration: 0.75 })
        } else if (mixMode === MixMode.singleInstance) {
          this._currentSound[channel].instance.stop()
        }
      }
      this._currentSound[channel] = { instance, gameSound, pixiSound, storePosition }
      instance.on('end', () => {
        this._currentSound[channel].instance.destroy()
        delete this._currentSound[channel]
      })
    // eslint-disable-next-line no-empty
    } catch (_e) {
    }
  }

  protected static getSound (sound: GameSound): Sound {
    if (sounds[sound] == null) {
      console.error(`No sound found for ${sound}`)
    }
    if (Array.isArray(sounds[sound])) {
      const path = defineAssetPath(sounds[sound][Math.floor(Math.random() * sounds[sound].length)])
      if (Assets.get(path) === undefined) {
        throw new Error(`No sound: ${sound}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Assets.get(path)
    } else {
      const path = defineAssetPath(sounds[sound] as string)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return Assets.get(path)
    }
  }

  public static stopSound (channel: Channel) {
    this._currentSound[channel]?.instance.destroy()
    delete this._currentSound[channel]
  }

  public static fadeOutSound (channel: Channel, duration = 0.75) {
    const soundInfo = this._currentSound[channel]
    if (soundInfo == null) return
    gsap.to(soundInfo.instance, {
      volume: 0,
      duration,
      onComplete: () => {
        soundInfo.instance.destroy()
      }
    })
  }

  public static getCurrentlyPlaying (channel: Channel) {
    return this._currentSound[channel]?.gameSound
  }

  public static set musicFiltered (value: boolean) {
    if (this._currentSound[Channel.music] != null) {
      this._currentSound[Channel.music].pixiSound.filters = value ? [this._filter] : []
    }
  }

  static getChannelVolume (channel: Channel): number {
    return this._channelVolume[channel]
  }

  static setChannelVolume (channel: Channel, volume: number) {
    this._channelVolume[channel] = volume
    if (this._currentSound[channel]?.instance) {
      this._currentSound[channel].instance.volume = volume
    }
    localforage.setItem(`${STORAGE_KEY_VOLUME}-${channel}`, volume)
  }
}
