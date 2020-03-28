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
import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    //useRouteMatch,
    //useParams
  } from "react-router-dom";

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

//   let match = useRouteMatch(); 
// https://reacttraining.com/react-router/web/guides/quick-start

// tslint:disable-next-line:no-empty-interface
interface LocalState {}

type AllProps = Props & DispatchProps & StateProps & AppContextProps;

const RealTownView = (props: AllProps) => {

    // let match = useRouteMatch();

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
        SoundManager.playMusicTrack(MusicTrack.town);
    }, []);

    // public changeSize(node: Konva.Node) {
    //     node.to({
    //         scaleX: Math.random() + 2.8,
    //         scaleY: Math.random() + 2.8,
    //         duration: 10,
    //     });
    // }

    const handleStructureClick = (evt: Konva.KonvaEventObject<PointerEvent>) => {
        if (props.onStructureClick) { props.onStructureClick( Structure[evt.target.name()]); }
    }

    const handleBackgroundClick = () => {
        if (props.onStructureClick) { props.onStructureClick(null); }
    }

    const imgSrc = (url: string): HTMLImageElement => {
        const result = props.media!.find((m) => m.url === url);
        if (result === undefined) {
            throw Error(`Could not find image with url ${url}`);
        } else {
            return result.content as HTMLImageElement;
        }
    }


    const structures = Object.keys(Structure).map((structure, index) => {
        const structureDef = getDefinition(structure);
        const structureStore: StructureStoreState = props.structures[structure];
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
            onClick = { handleStructureClick }
        />;
    });

    return (
        <Stage width={1024} height={768} scale= { {x: 0.4, y: 0.4} }>
        <Layer name="background" onClick = { handleBackgroundClick } >
            {/* <Image image={ imgSrc("img/town/sky.jpg") }></Image> */}
        </Layer>
        <Layer name="town">
                {/* <Image
                    name = "warehouse"
                    // image={ imgSrc("img/town/tavern.png") }
                    x = { 15 }
                    y = { 1057 }
                    // stroke = "blue"
                    shadowBlur={15}
                    shadowColor = "red"
                    shadowEnabled = { true }
                    strokeWidth = { 30 }
                    // onClick = { handleStructureClick }
                    // draggable
                    // onDragEnd= { handleDragEnd }
                    // ref={ (node) => { convaImages.tavern = node!; }}
                    ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                />

                <Image
                    name = { Structure.warehouse }
                    image={ imgSrc("img/town/lighthouse.png") }
                    // onClick = { handleStructureClick }

                    ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                /> */}
                {/* <Image
                    name = "lumberMill"
                    // image = { imgSrc("img/town/mill.png") }
                    x = { 947 }
                    y = { 1384 }
                    // stroke = "blue"
                    shadowBlur={15}
                    // shadowColor = "red"
                    // shadowEnabled = { true }
                    // strokeWidth = { 30 }
                    // onClick = { handleStructureClick }
                    // draggable
                    // onDragEnd= { handleDragEnd }
                    ref={ (node: Konva.Image) => { drawHitFromCache(node); }}
                /> */}
                { structures }

                </Layer>
                {/* <SmokeEmitter
                    emitterX = { 190 }
                    emitterY = { 510 }
                    smokeImg = { imgSrc("img/town/effects/smoke.png") }
                /> */}

        </Stage>
    );
}

const drawHitFromCache = (img: Konva.Image) => {
    if (img) {
       // img.cache(null);
       // img.drawHitFromCache(0.5);
    }
};

export default RealTownView;
