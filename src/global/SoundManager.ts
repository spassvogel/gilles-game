import { MediaItem } from "components/preloading/Preloader";
import { Howl } from "howler";
import localforage from 'localforage';

export enum MusicTrack {
    town,
    world,
}

export enum Sound {
    buttonClick,
    error,
    toast
}

let media: MediaItem[];

const musicTracks: { [key: number]: Howl; } = {};
let currentMusicTrack: MusicTrack|null = null;

const sounds: { [key: number]: Howl; } = {};
const DEFAULT_MUSIC_VOLUME = 0.8;
const STORAGE_KEY_MUSIC_VOLUME = "musicVolume";
const DEFAULT_SOUND_VOLUME = 1;
const STORAGE_KEY_SOUND_VOLUME = "soundVolume";

export class SoundManager {
    private static _musicVolume: number = DEFAULT_MUSIC_VOLUME;
    private static _soundVolume: number = DEFAULT_SOUND_VOLUME;

    public static async init() {
        // Attempt to fetch volumes from storage. If not set, revert to defaults
        this._musicVolume = await localforage.getItem(STORAGE_KEY_MUSIC_VOLUME) || this.musicVolume;
        this._soundVolume = await localforage.getItem(STORAGE_KEY_SOUND_VOLUME) || this.soundVolume;
    }

    public static loadMedia(m: MediaItem[]) {
        media = m;
    }

    public static addSounds(soundList: Record<Sound, string>) {
        Object.entries(soundList).forEach(([key, value]) => {
            // todo: assert [10/07/2019 ASSERTS]
            sounds[key] = media.find((m) => m.url === value)!.content;
        });
    }

    public static playSound(sound: Sound) {
        const howl = sounds[sound];
        howl.volume(this.soundVolume);
        console.log(this.soundVolume)
        howl.play();
    }

    public static addMusicTrack(track: MusicTrack, url: string) {
        if (!media) { return; }
        const sound = media.find((m) => m.url === url);
        if (!sound) {
            throw new Error(`No sound found at ${url}`);
        }
        if (!musicTracks.hasOwnProperty(track)) {
            musicTracks[track] = sound.content as Howl;
        }
    }

    /**
     * Fades out currently playing music and fades new music in
     * @param track
     */
    public static playMusicTrack(track: MusicTrack) {
        if (!media) { return; }

        if (currentMusicTrack !== null) {
            const currentMusic: Howl = musicTracks[currentMusicTrack];
            currentMusic.fade(SoundManager.musicVolume, 0, 500);
        }
        const nextMusic = musicTracks[track];
        if (!nextMusic.playing()) {
            nextMusic.loop(true);
            nextMusic.play();
        }

        nextMusic.fade(0, SoundManager.musicVolume, 500);

        currentMusicTrack = track;
    }

    static set soundVolume(volume: number) {
        this._soundVolume = volume;
        localforage.setItem(STORAGE_KEY_SOUND_VOLUME, volume);
    }

    static get soundVolume(): number {
        return this._soundVolume;
    }

    static set musicVolume(volume: number) {
        if (currentMusicTrack) {
            musicTracks[currentMusicTrack].volume(volume);
        }
        this._musicVolume = volume;
        localforage.setItem(STORAGE_KEY_MUSIC_VOLUME, `${volume}`);
    }

    static get musicVolume() : number {
        return this._musicVolume;
    }
}
