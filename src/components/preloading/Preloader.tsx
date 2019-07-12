import { Howl } from "howler";
import * as React from "react";
import Indicator from "./Indicator";

// https://medium.com/@jchiam/publishing-a-typescript-react-component-to-npm-d3cc15b8d0a2
export interface Props {
    manifest: string[];
    onLoadComplete?: (mediaItems: MediaItem[]) => void;
}

enum MediaType {
    image,
    sound,
}

export interface MediaItem {
    url: string;
    mediaType: MediaType;
    element: HTMLElement | Howl;
}

interface State {
    itemsLoaded: number;
    completed: boolean;
}

export default class Preloader extends React.Component<Props, State> {
//    private mounted = false;

    constructor(props: Props) {
        super(props);

        this.state = {
            completed: false,
            itemsLoaded: 0,
        };
    }

    public componentDidMount() {
        // this.mounted = true;
        this.loadMedia();
    }

    public componentDidUpdate(prevProps: Props) {
        // const { images } = this.props;
        // const oldImages = new Set(prevProps.images);

        // let hasChanged = false;
        // for (let i = 0; i < images.length; i += 1) {
        //     const image = images[i];
        //     if (!oldImages.has(image)) {
        //         hasChanged = true;
        //         break;
        //     }
        // }

        // if (hasChanged) {
        //     this.loadImages();
        // }
        // todo: implement
    }

    public componentWillUnmount() {
        // this.mounted = false;
        // if (this.autoResolveTimeout) {
        //     clearTimeout(this.autoResolveTimeout);
        // }
    }

    public render() {
//        console.log(`loaded: ${this.state.itemsLoaded} `);
        const { children, manifest } = this.props;
        const complete = this.state.completed;

        const indicator = <Indicator
            itemsLoaded = { this.state.itemsLoaded }
            itemsTotal = { manifest.length }
        />;

        return complete ? children : indicator;

    }

    protected loadMedia = () => {
        // todo: what if props get set at runtime
        this.setState({
            itemsLoaded: 0,
        });

        const promises = this.props.manifest
            .map((url) => this.loadItem(url)
            // tslint:disable-next-line:no-console
            .catch((err) => console.error(err)));

        Promise.all(promises).then((results) => {
            if (this.props.onLoadComplete) {
                this.props.onLoadComplete(media);
            }
            this.setState({
                completed: true,
            });
        });
    }

    protected loadItem = async (url: string): Promise<MediaItem> => {
        if (media.some((m) => m.url === url)) {
            // tslint:disable-next-line:no-console
            console.warn(`Loading media with url ${url} more than once! Will overwrite.`);
        }
        const mediaType = getType(url);
        let item;
        switch (mediaType) {
            case MediaType.image: {
                // try {
                const value = await loadImage(url);
                // console.log(`loaded ${url}`); // tODO: remove
                item = {
                    element: value,
                    mediaType,
                    url,
                };
                // } catch (e) {
                //     throw Error(`Could not load image with url '${url}'`);
                // }
            }
            case MediaType.sound: {
                const value = new Howl({
                    src: [ url ],
                });
                item = {
                    element: value,
                    mediaType,
                    url,
                };
            }
        }
        if (item) {
            media.push(item);
            this.setState({
                itemsLoaded: this.state.itemsLoaded + 1,
            });
            return item;
        } else {
            throw new Error(`Unknown error while trying to load ${url}`);
        }
    }
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
