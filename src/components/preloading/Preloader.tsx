import { Howl } from "howler";
import * as React from "react";
import Indicator from "./Indicator";
import { useState, useEffect } from 'react';

// https://medium.com/@jchiam/publishing-a-typescript-react-component-to-npm-d3cc15b8d0a2
export interface Props {
    manifest: string[];
    onLoadComplete?: (mediaItems: MediaItem[]) => void;
    children: any;
}

export enum MediaType {
    image,
    sound,
}

export interface MediaItem {
    url: string;
    mediaType: MediaType;
    content?: HTMLImageElement | Howl;
    sound?: Howl;
}

const Preloader = (props: Props) => {    

    const [completed, setCompleted] = useState(false);
    const [itemsLoaded, setItemsLoaded] = useState(0);

    useEffect(() => {
        loadMedia();
    }, []);

    const { children, manifest } = props;

    const indicator = <Indicator
        itemsLoaded = { itemsLoaded }
        itemsTotal = { manifest.length }
    />;

    const loadMedia = () => {
        // todo: what if props get set at runtime
        setItemsLoaded(0);

        const promises = props.manifest
            .map((url) => loadItem(url)
            // tslint:disable-next-line:no-console
            .catch((err) => console.error(err)));

        Promise.all(promises).then((results) => {
            if (props.onLoadComplete) {
                props.onLoadComplete(media);
            }
            setCompleted(true);
        });
    }

    const loadItem = async (url: string): Promise<MediaItem> => {
        if (media.some((m) => m.url === url)) {
            // tslint:disable-next-line:no-console
            console.warn(`Loading media with url ${url} more than once! Will overwrite.`);
        }
        const mediaType = getType(url);
        let item;
        if (mediaType === MediaType.image) {
            const value = await loadImage(url);
            item = {
                content: value,
                mediaType,
                url,
            } ;
        }
        if (mediaType === MediaType.sound) {
            const value = new Howl({
                src: [ url ],
            });
            item = {
                content: value,
                mediaType,
                url,
            };
        }
        if (item) {
            media.push(item);
            setItemsLoaded(itemsLoaded + 1);
            return item;
        } else {
            throw new Error(`Unknown error while trying to load ${url}`);
        }
    }

    return completed ? children : indicator;
}

const media: MediaItem[] = [];

const loadImage = (url: string): Promise<HTMLImageElement> => {
    const image = new Image();
    image.src = url;

    return new Promise((resolve, reject) => {
        if (image.naturalWidth) {
            resolve(image);
        } else if (image.complete) {
            reject(null);
        } else {
            image.addEventListener("load", check);
            image.addEventListener("error", check);
        }
        function check() {
            if (image.naturalWidth) {
                resolve(image);
            } else {
                reject(null);
            }
            image.removeEventListener("load", check);
            image.removeEventListener("error", check);
        }
    });
};

const getType = (url: string): MediaType => {
    url = url.toLowerCase();
    if (url.endsWith("png") || url.endsWith("jpg") || url.endsWith("gif")) {
        return MediaType.image;
    }
    if (url.endsWith("mp3") || url.endsWith("ogg") || url.endsWith("wav")) {
        return MediaType.sound;
    }
    throw Error(`Could not determine type for ${url}`);
};

export default Preloader;