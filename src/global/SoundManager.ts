import localforage from 'localforage';
import { Sound, IMediaInstance, filters } from '@pixi/sound';
import { gsap } from 'gsap';
import { Loader } from 'pixi.js';

export enum Channel {
  music,
  ui,
  scene,
  ambient,
}

export enum MixMode {
  singleInstance,   // Only one sound plays at the same time in this channel
  layered,      // Multiple sounds can play in this channel
  fade,        // Fades out currently playing sound on this channel and fades new music in
}

export enum Music {
  town,
  world,
}

export type GameSound =
  'ambient/structure/alchemist' |
  'ambient/structure/smith' |
  'ambient/structure/tavern' |
  'ambient/structure/warehouse' |
  'ui/buttonClick' |
  'ui/equip' |
  'ui/error' |
  'ui/levelUp' |
  'ui/toast' |
  'music/combat' |
  'music/town' |
  'music/world' |
  'music/violettesElficSong' |
  'scene/bow' |
  'scene/crossbow' |
  'scene/daggerSwish' |
  'scene/doorOpen' |
  'scene/drinking' |
  'scene/meleeHit' |
  'scene/metalBash' |
  'scene/parry' |
  'scene/shieldBash' |
  'scene/swish' |
  'scene/swordHitFlesh'
;

type SoundInfo = {
  instance: IMediaInstance;
  gameSound: GameSound;
  pixiSound: Sound;
  storePosition?: boolean;
};

const DEFAULT_MUSIC_VOLUME = 0;
const DEFAULT_UI_VOLUME = 1;
const DEFAULT_SCENE_VOLUME = 1;
const DEFAULT_AMBIENT_VOLUME = 0.2;
const STORAGE_KEY_VOLUME = 'channelVolume';

export class SoundManager {
  private static _sounds: { [key: string]: Sound[] } = {};

  private static _currentSound: { [key: number]: SoundInfo } = {};  // per channel

  private static _storedPositions: { [key: string]: number } = {};

  private static _channelVolume: { [key: number]: number } = {};

  private static _initialized = false;

  private static _filter = new filters.TelephoneFilter();

  public static async init() {
    // Attempt to fetch volumes from storage. If not set, revert to defaults
    this._channelVolume = {
      [(Channel.music)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.music}`) ?? DEFAULT_MUSIC_VOLUME,
      [(Channel.ui)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.ui}`) ?? DEFAULT_UI_VOLUME,
      [(Channel.scene)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.scene}`) ?? DEFAULT_SCENE_VOLUME,
      [(Channel.ambient)]: await localforage.getItem(`${STORAGE_KEY_VOLUME}-${Channel.ambient}`) ?? DEFAULT_AMBIENT_VOLUME,
    };
    this._initialized = true;
  }


  public static async addSound(gameSound: GameSound, files: string[] | string, complete?: (sounds: Sound[]) => void) {
    const promise = new Promise<Sound[]>((resolve, _reject) => {
      if (typeof files === 'string') {
        files = [files];
      }
      if (this._sounds[gameSound]) {
        // Sound already loaded. Great.
        complete?.(this._sounds[gameSound]);
        resolve(this._sounds[gameSound]);
        return;
      }

      const loader = new Loader();
      files.map((file) => loader.add(file));
      loader.load((_, resources) => {
        if (resources) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore no 'sound' property on LoaderResource
          this._sounds[gameSound] = Object.values(resources).filter(Boolean).map(r => r.sound);
          complete?.(this._sounds[gameSound]);
          resolve(this._sounds[gameSound]);
        }
      });
    });
    return promise;
  }

  /**
   * Plays a sound. The sound needs to be loaded through `addSound` first!
   * @param gameSound the GameSound to play
   * @param channel channel to play the sound on
   * @param loop true to make the sound repeat
   * @param mixMode how to mix in the new sound into the channel
   * @param storePosition Store position of current sound on this channel in order to resume
   */
  public static async playSound(gameSound: GameSound, channel: Channel = Channel.ui, loop = false, mixMode: MixMode = MixMode.singleInstance, storePosition = false) {
    if (!this._initialized) {
      await this.init();
    }

    try {
      const pixiSound = this.getSound(gameSound);
      if (!pixiSound) {
        console.warn(`Can't find sound ${gameSound}`);
      }
      pixiSound.volume = this._channelVolume[channel];
      pixiSound.loop = loop;

      if (this._currentSound[channel]?.storePosition) {
        // Did we have to store the position of the current sound?
        const oldSoundInfo = this._currentSound[channel];
        oldSoundInfo.instance.once('progress', (progress: number, duration: number) => {
          this._storedPositions[oldSoundInfo.gameSound] = progress * duration;
        });
      }
      const start = this._storedPositions[gameSound] ?? 0;

      const instance = await pixiSound.play({ start });

      if (this._currentSound[channel]) {
        if (mixMode === MixMode.fade) {
        // Fade out current sound on this channel and fade in new sound
          SoundManager.fadeOutSound(channel);
          // Fade in the new sound
          gsap.from(instance, { volume: 0, duration: 0.75 });
        } else if (mixMode === MixMode.singleInstance) {
          this._currentSound[channel].instance.stop();
        }
      }
      this._currentSound[channel] = { instance, gameSound, pixiSound, storePosition };
      instance.on('end', () => {
        this._currentSound[channel].instance.destroy();
        delete this._currentSound[channel];
      });
    // eslint-disable-next-line no-empty
    } catch (_e) {
    }
  }

  protected static getSound(sound: GameSound): Sound {
    if (!this._sounds[sound]?.length) {
      console.error(`No sound found for ${sound}`);
    }
    if (this._sounds[sound].length === 1) {
      return this._sounds[sound][0];
    } else {
      return this._sounds[sound][Math.floor(Math.random() * this._sounds[sound].length)];
    }
  }

  public static stopSound(channel: Channel) {
    this._currentSound[channel]?.instance.destroy();
    delete this._currentSound[channel];
  }

  public static fadeOutSound(channel: Channel, duration = 0.75) {
    const soundInfo = this._currentSound[channel];
    if (!soundInfo) return;
    gsap.to(soundInfo.instance, { volume: 0, duration, onComplete: () => {
      soundInfo.instance.destroy();
    } });
  }

  public static getCurrentlyPlaying(channel: Channel) {
    return this._currentSound[channel]?.gameSound;
  }

  public static hasSoundLoaded(sound:  GameSound) {
    return !!this._sounds[sound];
  }

  public static set musicFiltered(value: boolean) {
    if (this._currentSound[Channel.music]) {
      this._currentSound[Channel.music].pixiSound.filters = value ? [ this._filter ] : [];
    }
  }

  static getChannelVolume(channel: Channel): number {
    return this._channelVolume[channel];
  }

  static setChannelVolume(channel: Channel, volume:number) {
    this._channelVolume[channel] = volume;
    if (this._currentSound[channel]?.instance) {
      this._currentSound[channel].instance.volume = volume;
    }
    localforage.setItem(`${STORAGE_KEY_VOLUME}-${channel}`, volume);
  }
}
