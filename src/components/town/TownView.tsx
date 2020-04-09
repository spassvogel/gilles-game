import React, { useRef, useEffect } from "react";
import { Stage, Sprite, Graphics } from '@inlet/react-pixi';
import {  ClickEventData } from "pixi-viewport";
import { Structure } from 'definitions/structures';
import { StructuresStoreState } from 'stores/structures';
import { SoundManager, MusicTrack } from 'utils/soundManager';
import { Viewport as PixiViewport} from "pixi-viewport";
import Viewport from '../pixi/Viewport';
import { StructureState, StructureStoreState } from 'stores/structure';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import "./css/townView.css"
import { MAX_WIDTH } from 'components/App';
import * as PIXI from 'pixi.js';

const HEIGHT = 1079;
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 1600;

// This might be the town view
// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {

}

export interface Props {
    onStructureClick?: (structure: Structure | null) => void;
}



type AllProps = Props & DispatchProps;

const TownView = (props: AllProps) => {

    // let match = useRouteMatch();

    React.useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
        SoundManager.playMusicTrack(MusicTrack.town);
    }, []);

    const handleStructureClick = (structure: Structure) => {
        if (!dragging.current && props.onStructureClick) { 
            props.onStructureClick(structure); 
        }
    }

    // const handleBackgroundClick = () => {
    //     if (props.onStructureClick) { props.onStructureClick(null); }
    // }
    console.log('rendering town');

    const structures = useSelector<StoreState, StructuresStoreState>((state: StoreState) => {
        return state.structures;
    });

    const renderStructures = () => {
        const orderedStructures = [
            Structure.workshop,
            Structure.quarry,
            Structure.tavern,
            Structure.tannery,
            Structure.alchemist,
            Structure.garden,
            Structure.weaponsmith,
            Structure.armoursmith,
            Structure.warehouse,
            Structure.mine,
            Structure.lumberMill,
            Structure.weaver,
        ]
        return orderedStructures.reverse().map((structure) => {
            const structureStore: StructureStoreState = structures[structure];
            if (structureStore.state === StructureState.NotBuilt) {
                return null;
            }
               
            let x, y;              
            switch (structure) {
                case Structure.workshop:
                    x = 373;
                    y = 610;
                    break;
                case Structure.quarry:
                    x = 632;
                    y = 633;
                    break;
                case Structure.tavern:
                    x = 500;
                    y = 469;
                    break;
                case Structure.tannery:
                    x = 372;
                    y = 460;
                    break;
                case Structure.alchemist:
                    x = 411;
                    y = 371;
                    break;
                case Structure.garden:
                    x = 822;
                    y = 689;
                    break;
                case Structure.weaponsmith:
                    x = 449;
                    y = 460;
                    break;
                case Structure.armoursmith:
                    x = 473;
                    y = 442;
                    break;
                case Structure.warehouse:
                    x = 471;
                    y = 130;
                    break;
                case Structure.mine:
                    x = 183;
                    y = 527;
                    break;
                case Structure.lumberMill:
                    x = 391;
                    y = 307;
                    break;
                case Structure.weaver:
                    x = 484;
                    y = 333;
                    break;
            }              
            

            const shapeData = [{"shape":[37,0,53,5,52,12]},{"shape":[45,17,68,27,81,48]},{"shape":[81,48,81,56,72,67]},{"shape":[72,67,73,165,11,168]},{"shape":[11,168,6,166,9,65]},{"shape":[9,65,1,57,1,45]},{"shape":[1,45,10,30,31,19]},{"shape":[31,19,29,5,37,2]},{"shape":[37,0,52,12,44,13]},{"shape":[45,17,81,48,72,67]},{"shape":[72,67,11,168,9,65]},{"shape":[9,65,1,45,31,19]},{"shape":[31,19,37,2,34,18]},{"shape":[37,0,44,13,45,17]},{"shape":[72,67,9,65,31,19]},{"shape":[31,19,34,18,46,20]},{"shape":[46,20,37,0,45,17]},{"shape":[72,67,31,19,46,20]},{"shape":[46,20,45,17,72,67]}];
            const shapes = shapeData.map(({ shape }) => new PIXI.Polygon(shape));
console.log(shapes)
            return <Sprite 
                key={structure}
                name={structure}
                x={x}
                y={y}
                // hitArea={new Polygon([ 
                //     5, -86.013  , 12, -82.013  , 5, -70.013  , -9, -68.013  , -12, -81.013 
                //     -34, 82.987  , -32, -21.013000000000005  , -9, -68.013  , 5, -70.013  , 28, -59.013000000000005  , 32, -21.013000000000005  , 33, 82.987])}
                interactive={true}
                pointertap={() => {
                    handleStructureClick(structure);
                }}
                image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}          
            >
                <Graphics
                    name="hitarea"
                    // x = {41.000}
                    // y = {86.013}

                    draw={graphics => {
                        graphics.beginFill(0xffffff);
                        shapes.map(shape => graphics.drawPolygon(shape))
                        // graphics.drawPolygon([
                        //    // 37,0,53,5,52,12,45,17,68,27,81,48,81,48,81,56,72,67,72,67,73,165,11,168,11,168,6,166,9,65,9,65,1,57,1,45,1,45,10,30,31,19,31,19,29,5,37,2,37,0,52,12,44,13,45,17,81,48,72,67,72,67,11,168,9,65,9,65,1,45,31,19,31,19,37,2,34,18,37,0,44,13,45,17,72,67,9,65,31,19,31,19,34,18,46,20,46,20,37,0,45,17,72,67,31,19,46,20,46,20,45,17,72,67
                        //     // 5, -86.013  , 12, -82.013  , 5, -70.013  , -9, -68.013  , -12, -81.013, 
                        //     // -34, 82.987  , -32, -21.013000000000005  , -9, -68.013  , 5, -70.013  , 28, -59.013000000000005  , 32, -21.013000000000005  , 33, 82.987
         
                        //     // -34, 7.986999999999995  , -32, -21.013000000000005  , -39, -25.013000000000005  , -40, -42.013000000000005  , -34, -53.013000000000005  , -9, -68.013  , -12, -81.013  , 5, -86.013  , 12, -82.013  , 12, -73.013  , 5, -70.013  , 28, -59.013000000000005  , 41, -40.013000000000005  , 41, -29.013000000000005  , 32, -21.013000000000005  , 33, 82.987  , -34, 82.987  , -34, 75.987 
                        // ]);
                        graphics.endFill();
                    }}
                />
            </Sprite>
        });
    }

    let dragging = useRef(false);
    const ref = useRef<PixiViewport>(null);
    useEffect(() => {
        if(ref.current) {
            const viewport = ref.current;
            viewport.on("drag-start", () => { dragging.current = true; });
            viewport.on("drag-end", () => { dragging.current = false; });
        }
    }, []);

    return (
        <div className="town-view">
            <Stage width={MAX_WIDTH} height={HEIGHT} >
                <Viewport screenWidth={MAX_WIDTH} screenHeight={HEIGHT} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} ref={ref}>
                    <Sprite 
                        name="background"
                        image={`${process.env.PUBLIC_URL}/img/town/town-alpha/background.png`}          
                    >
                        {renderStructures()}
                    </Sprite>
                </Viewport>
            </Stage>
        </div>
    );
}

export default TownView;
