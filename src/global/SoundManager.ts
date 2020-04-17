import { MediaItem } from "components/preloading/Preloader";
import { Howl } from "howler";

export enum MusicTrack {
    town,
    world,
}

export enum Sound {
    buttonClick,
    error,
}

let media: MediaItem[];

const musicTracks: { [key: number]: Howl; } = {};
let currentMusicTrack: MusicTrack|null = null;

const sounds: { [key: number]: Howl; } = {};
const DEFAULT_MUSIC_VOLUME = 0.8;
const STORAGE_KEY_MUSIC_VOLUME = "musicVolume";

export class SoundManager {
    private static _musicVolume: number;
    private static _soundVolume: number;

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

    public static soundVolume(volume: number) {
        
    }

    static set musicVolume(volume: number) {
        if (currentMusicTrack) {
            musicTracks[currentMusicTrack].volume(volume);
        }
        this._musicVolume = volume;
        try {
            localStorage.setItem(STORAGE_KEY_MUSIC_VOLUME, `${volume}`);
        }
        catch (e) {}
    }

    static get musicVolume() : number {
        if (this._musicVolume !== undefined) {
            return this._musicVolume;
        }
        const fromStorage = localStorage.getItem(STORAGE_KEY_MUSIC_VOLUME);
        if (fromStorage == null) { 
            this._musicVolume = DEFAULT_MUSIC_VOLUME;
        } else {
            this._musicVolume = parseFloat(fromStorage);
            console.log('got value from storage', fromStorage)
        }
        return this._musicVolume;
    }
}
