import * as Konva from "konva";
import * as React from "react";
import { Image, Layer, Stage, Rect } from "react-konva";
import {  Structure  } from "src/definitions/structures";
import { AppContextProps } from "./App";
import "./css/townView.css";

// It's actually not the *real* town view hihi
export interface DispatchProps {
    onStructureClick?: (structure: Structure) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

// tslint:disable-next-line:no-empty-interface
export interface StateProps {
}

// tslint:disable-next-line:no-empty-interface
interface LocalState {
}

type AllProps = Props & DispatchProps & StateProps & AppContextProps;

class RealTownView extends React.Component<AllProps, LocalState> {

    private rect: Konva.Rect;
    constructor(props: AllProps) {
        super(props);
        console.log(`LOADING RTV ${props}`);
        this.state = {
            images: {},
        };
    }

    public componentDidMount() {
        var amplitude = 1;
        var period = 500;

        let anim = new Konva.Animation((frame: any) => {
          this.rect.opacity((Math.sin(frame.time / period) + 1) / 2);
        }, this.rect.getLayer());

        anim.start();
    }

    public changeSize(node: Konva.Node) {
        node.to({
            scaleX: Math.random() + 2.8,
            scaleY: Math.random() + 2.8,
            duration: 10,
        });
    }

    public render() {
        console.log(`RENDERING RTV: loaded media: ${this.props.media}`);
        return (
            <Stage width={1024} height={768} scale= { {x: 0.4, y: 0.4} }>
            <Layer name="background"  >
                <Image image={ this.imgSrc("img/town/sky.jpg") }></Image>
            </Layer>
            <Layer name="town">

                {/* <Rect
                    x={20}
                    y={20}
                    width={50}
                    height={50}
                    fill={ "white"}

                    // onClick={this.handleClick}
                /> */}
                <Rect
                    x={20}
                    y={20}
                    width={50}
                    height={50}
                    fill="green"
                    shadowBlur={5}
                    ref={(node: Konva.Rect) => { this.rect = node;  }}
                />
                   <Image
                        name = "warehouse"
                        image={ this.imgSrc("img/town/tavern.png") }
                        x = { 15 }
                        y = { 1057 }
                        // stroke = "blue"
                        shadowBlur={15}
                        shadowColor = "red"
                        shadowEnabled = { true }
                        strokeWidth = { 30 }
                        onClick = { this.handleClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        // ref={ (node) => { this.convaImages.tavern = node!; }}
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />

                    <Image
                        name = { "weaponsmith" }
                        image={ this.imgSrc("img/town/lighthouse.png") }
                        onClick = { this.handleClick }

                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />
                    <Image
                        name = "lumbermill"
                        image={ this.imgSrc("img/town/lumbermill.png") }
                        x = { 947 }
                        y = { 1384 }
                        // stroke = "blue"
                        shadowBlur={15}
                        // shadowColor = "red"
                        // shadowEnabled = { true }
                        // strokeWidth = { 30 }
                        onClick = { this.handleClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />

                    </Layer>
            </Stage>
        );
    }

    public handleClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (this.props.onStructureClick) { this.props.onStructureClick( Structure[evt.target.name()]); }
    }

    private imgSrc(url: string): HTMLImageElement {
        const result = this.props.media.find((m) => m.url === url);
        if (result === undefined) {
            throw Error(`Could not find image with url ${url}`);
        } else {
            return result.element as HTMLImageElement;
        }
    }
}

const drawHitFromCache = (img: Konva.Image) => {
    if (img) {
        img.cache();
        img.drawHitFromCache(0.5);
    }
};

export default RealTownView;
