import localforage from 'localforage';
import "pixi-sound";
import {gsap } from 'gsap';

export enum Channel {
    music,
    ui,
    scene
}

export enum MixMode {
    singleInstance,     // Only one sound plays at the same time in this channel
    layered,            // Multiple sounds can play in this channel
    fade                // Fades out currently playing sound on this channel and fades new music in
}

export enum Music {
    town,
    world,
}

export type Sound =
    "ui/buttonClick" |
    "ui/error" |
    "ui/toast" |
    "music/town" |
    "music/world"
    // todo: scene ssounds!
;

type SoundInfo = {
    instance: PIXI.sound.IMediaInstance;
    sound: Sound;
    storePosition?: boolean;
}

const DEFAULT_MUSIC_VOLUME = 0;
const STORAGE_KEY_MUSIC_VOLUME = "musicVolume";
const DEFAULT_SOUND_VOLUME = 1;
const STORAGE_KEY_SOUND_VOLUME = "soundVolume";

export class SoundManager {
    private static _sounds: { [key: string]: PIXI.sound.Sound[] } = {};
    private static _currentSound: { [key: number]: SoundInfo } = {};    // per channel
    private static _storedPositions: { [key: string]: number } = {};

    private static _musicVolume: number = DEFAULT_MUSIC_VOLUME;
    private static _soundVolume: number = DEFAULT_SOUND_VOLUME;
    private static _initialized = false;

    public static async init() {
        // Attempt to fetch volumes from storage. If not set, revert to defaults
        this._musicVolume = await localforage.getItem(STORAGE_KEY_MUSIC_VOLUME) || DEFAULT_MUSIC_VOLUME;
        this._soundVolume = await localforage.getItem(STORAGE_KEY_SOUND_VOLUME) || DEFAULT_SOUND_VOLUME;

        this._initialized = true;
    }


    public static async addSound(sound: Sound, files: string[] | string, complete?: (sounds: PIXI.sound.Sound[]) => void) {
        if (typeof files === "string") {
            files = [files];
        }
        if(this._sounds[sound]) {
            // Sound already loaded. Great.
            complete?.(this._sounds[sound]);
            return;
        }

        const loader = new PIXI.Loader();
        files.map((file) => loader.add(file));
        loader.load((_, resources) => {
            if (resources) {
                this._sounds[sound] = Object.values(resources!).filter(rss => !!rss).map(r => r?.sound!);
                complete?.(this._sounds[sound]);
            }
        });
    }

    /**
     * Plays a sound. The sound needs to be loaded through `addSound` first!
     * @param sound the sound
     * @param channel channel to play the sound on
     * @param loop true to make the sound repeat
     * @param mixMode how to mix in the new sound into the channel
     * @param storePosition Store position of current sound on this channel in order to resume
     */
    public static async playSound(sound: Sound, channel: Channel = Channel.ui, loop: boolean = false, mixMode: MixMode = MixMode.singleInstance, storePosition: boolean = false) {
        if (!this._initialized) {
            await this.init();
        }
        const pixiSound = this.getSound(sound);
        pixiSound.volume = this.soundVolume;
        pixiSound.loop = loop;
        if (this._currentSound[channel]?.storePosition) {
            // Did we have to store the position of the current sound?
            const oldSoundInfo = this._currentSound[channel];
            // @ts-ignore
            oldSoundInfo.instance.once('progress', (progress: number , duration: number) => {
                this._storedPositions[oldSoundInfo.sound] = progress * duration;
            });
        }
        const start = this._storedPositions[sound] ?? 0;
        const instance = await pixiSound.play({ start });

        if (this._currentSound[channel]) {
            if (mixMode === MixMode.fade) {
                // Fade out current sound on this channel and fade in new sound
                const oldSoundInfo = this._currentSound[channel];
                gsap.to(oldSoundInfo.instance, { volume: 0, duration: .75, onComplete: (a) => {
                    oldSoundInfo.instance.destroy();
                }});
                // Fade in the new sound
                gsap.from(instance, { volume: 0, duration: 0.75 });
            }
            else if (mixMode === MixMode.singleInstance) {
                this._currentSound[channel].instance.stop();
            }
        }
        this._currentSound[channel] = { instance, sound, storePosition };
        instance.on('end', () => {
            this._currentSound[channel].instance.destroy();
            delete this._currentSound[channel];
        });
    }

    protected static getSound(sound: Sound) {
        if (!this._sounds[sound]?.length) {
            throw new Error(`No sound found for ${sound}`);
        }
        if (this._sounds[sound].length === 1) {
            return this._sounds[sound][0];
        }
        else {
            return this._sounds[sound][Math.floor(Math.random() * this._sounds[sound].length)];
        }
     }

    static set soundVolume(volume: number) {
        this._soundVolume = volume;
        localforage.setItem(STORAGE_KEY_SOUND_VOLUME, volume);
    }

    static get soundVolume(): number {
        return this._soundVolume;
    }

    static set musicVolume(volume: number) {
        // if (currentMusicTrack) {
        //     //musicTracks[currentMusicTrack].volume(volume);
        // }
        this._musicVolume = volume;
        localforage.setItem(STORAGE_KEY_MUSIC_VOLUME, volume);
    }

    static get musicVolume() : number {
        return this._musicVolume;
    }
}
