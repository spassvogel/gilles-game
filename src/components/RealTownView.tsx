import * as Konva from "konva";
import * as React from "react";
import { Image, Layer, Rect, Shape, Stage, Text } from "react-konva";
import structureDefinitions, {  Structure, StructureDefinition  } from "src/definitions/structures";
import { StructuresStoreState } from "src/stores/structures";
import "./css/townView.css";

// It's actually not the *real* town view hihi
export interface DispatchProps {
    onStructureClick?: (structure: Structure) => void;
}

// tslint:disable-next-line:no-empty-interface
export interface Props {

}

export interface StateProps {
}

interface LocalState {
    images: ImageElementsLocalState;
}

interface ImageElementsLocalState {
    background?: HTMLImageElement;
    lighthouse?: HTMLImageElement;
    tavern?: HTMLImageElement;
}

interface KonvaImages {
    background?: Konva.Image;
    lighthouse?: Konva.Image;
    tavern?: Konva.Image;
}

// export default function(props: Props & DispatchProps & StateProps) {
class RealTownView extends React.Component<Props & DispatchProps & StateProps, LocalState> {

    private convaImages: KonvaImages = {};

    constructor(props: Props & DispatchProps & StateProps) {
        super(props);

        this.state = {
            images: {},
        };
    }

    public componentDidMount() {
        this.loadImage("background", "img/town/sky.jpg");
        this.loadImage("lighthouse", "img/town/lighthouse.png");
        this.loadImage("tavern", "img/town/tavern.png");
    }

    // Loads image, stores in state after done loading
    public loadImage = (name: string, path: string ) => {
        const image = document.createElement("img");
        image.name = name;
        image.src = path;
        image.onload = () => {
            const callback = () => {
                const convaImage = this.convaImages[name] as Konva.Image;
                if(convaImage) {
                    convaImage.cache();
                    convaImage.drawHitFromCache(0.5);
                
                    this.changeSize(convaImage);
                }
            };
            this.setState((prev) => ({
                images: {
                    ...prev.images,
                    [name]: image,
                },
            }), callback);
        };
    }

    public changeSize(node: Konva.Node) {
        node.to({
            scaleX: Math.random() + 2.8,
            scaleY: Math.random() + 2.8,
            duration: 10
        });
    }

    public render() {

        const structures: Structure[] = [
            Structure.lumberMill,
            Structure.ironMine,
            Structure.farm,
            Structure.tannery,
            Structure.weaponsmith,
            Structure.armoursmith,
            Structure.warehouse,
        ];

        return (
            <Stage width={800} height={600} scale= { {x: 0.4, y: 0.4} }>
            <Layer name="background"  >
                { this.state.images.background && <Image image={ this.state.images.background! } />}
            </Layer>
            <Layer name="town">

                <Rect
                    x={20}
                    y={20}
                    width={50}
                    height={50}
                    fill={ "white"}


                    // onClick={this.handleClick}
                />
                    { this.state.images.tavern && <Image 
                        name = "tavern"
                        image= { this.state.images.tavern! }
                        x = { 15 }
                        y = { 1057 }
                        stroke = "blue"
                        shadowBlur={15}
                        shadowColor = "red"
                        shadowEnabled = { true }
                        strokeWidth = { 30 }
                        onClick = { this.handleClick }
                        // draggable
                        onDragEnd= { this.handleDragEnd } 
                        ref={ (node) => { this.convaImages.tavern = node!; }}
                    />}


                    { this.state.images.lighthouse && <Image image={ this.state.images.lighthouse! }
                     ref={ (node) => { this.convaImages.lighthouse = node!; }} />}
                    </Layer>
            </Stage>
        );
    }

    public handleClick(evt: Konva.KonvaEventObject<PointerEvent>) {
        console.log(evt.target.name());
    }

    public handleDragEnd(evt: Konva.KonvaEventObject<DragEvent>) {
        console.log(evt.target.x(), evt.target.y());
    }
}

export default RealTownView;
