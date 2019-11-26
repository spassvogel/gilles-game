import { getDefinition, Structure  } from "definitions/structures";
import { AppContextProps } from "hoc/withAppContext";
import Konva from "konva";
import * as React from "react";
import { Image, Layer, Stage, Text } from "react-konva";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { MusicTrack, SoundManager } from "utils/soundManager";
import { TextManager } from "utils/textManager";
import "./css/townView.css";

// It's actually not the *real* town view hihi
// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {

}

export interface Props {
    onStructureClick?: (structure: Structure | null) => void;
}

export interface StateProps {
    structures: StructuresStoreState;
    // tasks: TaskStoreState[];
}

// tslint:disable-next-line:no-empty-interface
interface LocalState {}

type AllProps = Props & DispatchProps & StateProps & AppContextProps;

class RealTownView extends React.Component<AllProps, LocalState> {

    private anim?: Konva.Animation = undefined;

    constructor(props: AllProps) {
        super(props);
        this.state = {
            images: {},
        };

        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
    }

    public componentDidMount() {
        this.playMusic();

        /*        const period = 500;
        if (this.plasmaBeam) {
            this.plasmaBeam.filters([Konva.Filters.Brighten]);
            //this.plasmaBeam.cache(null);
            this.anim = new Konva.Animation((frame: any) => {
                if (this.plasmaBeam){
                const freq = 2; // speed
                const brightness = (Math.sin((frame.time / period) * freq) + 1) / 2;   // fluctuate between 0 and 1
                this.plasmaBeam.brightness(brightness);
                //this.plasmaBeam.cache(null);
                this.plasmaBeam.fillPatternOffsetX(this.plasmaBeam.fillPatternOffsetX() - 150);
                }
            }, this.plasmaBeam.getLayer());

            this.anim.start();
        }*/
    }

    public componentWillUnmount() {
        if (this.anim) { this.anim.stop(); }
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
        const structures = Object.keys(Structure).map((structure, index) => {
            const structureDef = getDefinition(structure);
            const structureStore: StructureStoreState = this.props.structures[structure];
            if (structureStore.state === StructureState.NotBuilt) {
                return null;
            }
            const levelDef = structureDef.levels[structureStore.level];
            const displayName = TextManager.get(levelDef.displayName);

            return <Text name= { structure }
                key = { structure }
                text = { `█ ${displayName} (level ${structureStore.level + 1})` }
                x = { 100 }
                y = { 90 * index + 100 }
                fontSize = { 80 }
                fill = { "white" }
                onClick = { this.handleStructureClick }
            />;
        });
        // tslint:disable-next-line:no-console
        console.log(`rendered the town`); // TODO: remove

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
                {/* <Rect
                     PLASMA BEAM
                    x={20}
                    y={20}
                    width={1500}
                    height={256}
                    fillPatternImage = { this.imgSrc("img/town/effects/plasma_beam_heavy_green.png") }
                    fillPatternOffset = { { x: 20, y: 0 }}
                    globalCompositeOperation = "lighter"
                    shadowBlur={5}
                    ref = { (node: Konva.Rect) => this.plasmaBeam = node }
                /> */}
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
                        // onClick = { this.handleStructureClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        // ref={ (node) => { this.convaImages.tavern = node!; }}
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />

                    <Image
                        name = { Structure.warehouse }
                        image={ this.imgSrc("img/town/lighthouse.png") }
                        // onClick = { this.handleStructureClick }

                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />
                    <Image
                        name = "lumberMill"
                        image = { this.imgSrc("img/town/mill.png") }
                        x = { 947 }
                        y = { 1384 }
                        // stroke = "blue"
                        shadowBlur={15}
                        // shadowColor = "red"
                        // shadowEnabled = { true }
                        // strokeWidth = { 30 }
                        // onClick = { this.handleStructureClick }
                        // draggable
                        // onDragEnd= { this.handleDragEnd }
                        ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                    />
                    { structures }

                    </Layer>
                    {/* <SmokeEmitter
                        emitterX = { 190 }
                        emitterY = { 510 }
                        smokeImg = { this.imgSrc("img/town/effects/smoke.png") }
                    /> */}

            </Stage>
        );
    }

    public handleStructureClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (this.props.onStructureClick) { this.props.onStructureClick( Structure[evt.target.name()]); }
    }

    public handleBackgroundClick = () => {
        if (this.props.onStructureClick) { this.props.onStructureClick(null); }
    }

    private imgSrc(url: string): HTMLImageElement {
        const result = this.props.media!.find((m) => m.url === url);
        if (result === undefined) {
            throw Error(`Could not find image with url ${url}`);
        } else {
            return result.content as HTMLImageElement;
        }
    }

    private playMusic() {
        SoundManager.playMusicTrack(MusicTrack.town);
    }
}

const drawHitFromCache = (img: Konva.Image) => {
    if (img) {
       // img.cache(null);
       // img.drawHitFromCache(0.5);
    }
};

export default RealTownView;
