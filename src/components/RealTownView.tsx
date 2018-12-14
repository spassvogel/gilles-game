import * as Konva from "konva";
import * as React from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import {  Structure  } from "src/definitions/structures";
import { AppContextProps } from "./App";
import "./css/townView.css";

// It's actually not the *real* town view hihi
export interface DispatchProps {
    onStructureClick?: (structure: Structure | null) => void;
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
    private anim: Konva.Animation;

    constructor(props: AllProps) {
        super(props);
        this.state = {
            images: {},
        };
    }

    public componentDidMount() {
        const period = 500;

        this.anim = new Konva.Animation((frame: any) => {
          this.rect.opacity((Math.sin(frame.time / period) + 1) / 2);
        }, this.rect.getLayer());

        this.anim.start();
    }

    public componentWillUnmount() {
        this.anim.stop();
        delete this.anim;
    }

    // public changeSize(node: Konva.Node) {
    //     node.to({
    //         scaleX: Math.random() + 2.8,
    //         scaleY: Math.random() + 2.8,
    //         duration: 10,
    //     });
    // }

    public render() {
        return (
            <Stage width={1024} height={768} scale= { {x: 0.4, y: 0.4} }>
            <Layer name="background" onClick = { this.handleBackgroundClick } >
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
                        onClick = { this.handleStructureClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        // ref={ (node) => { this.convaImages.tavern = node!; }}
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />

                    <Image
                        name = { "weaponsmith" }
                        image={ this.imgSrc("img/town/lighthouse.png") }
                        onClick = { this.handleStructureClick }

                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />
                    <Image
                        name = "lumberMill"
                        image={ this.imgSrc("img/town/lumberMill.png") }
                        x = { 947 }
                        y = { 1384 }
                        // stroke = "blue"
                        shadowBlur={15}
                        // shadowColor = "red"
                        // shadowEnabled = { true }
                        // strokeWidth = { 30 }
                        onClick = { this.handleStructureClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />

                    </Layer>
            </Stage>
        );
    }

    public handleStructureClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (this.props.onStructureClick) { this.props.onStructureClick( Structure[evt.target.name()]); }
    }

    public handleBackgroundClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (this.props.onStructureClick) { this.props.onStructureClick(null); }
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
