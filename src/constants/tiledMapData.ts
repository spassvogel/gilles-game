enum Orientation {
    orthagonal = "orthagonal",
    isometric = "isometric",
    staggered = "staggered",
    hexagonal = "hexagonal"
}

enum RenderOrder {
    rightUp = "right-up",
    rightDown = "right-down",
    leftUp = "left-up",
    leftDown = "left-down"
}

export interface TiledTilesetData {
    columns: number;
    source: string;
    image: string;
    imagewidth: number;
    imageheight: number;
    tilewidth: number;
    tileheight: number;
    name: string;
}

export interface TiledLayerData {
    data: Array<number>;
    height: number;
    id: number;
    name: string;
    opacity: number; // not supported atm
    visible: boolean;
    x: number;
    y: number;
    width: number;    
}

export interface TiledMapData {
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
    infinite: boolean;
    backgroundcolor: string | null;
    orientation: Orientation;
    renderorder: RenderOrder;
    tilesets: TilesetData[];
    layers: TiledLayerData[];
}