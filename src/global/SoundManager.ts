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

export class SoundManager {
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
            currentMusic.fade(1, 0, 500);
        }
        const nextMusic = musicTracks[track];
        if (!nextMusic.playing()) {
            nextMusic.loop(true);
            nextMusic.play();
        }
        nextMusic.fade(0, 1, 500);

        currentMusicTrack = track;
    }
}
