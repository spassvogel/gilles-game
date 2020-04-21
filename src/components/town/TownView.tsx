import React, { useRef, useEffect } from "react";
import { Stage, Sprite } from '@inlet/react-pixi';
import { Structure } from 'definitions/structures';
import { StructuresStoreState } from 'stores/structures';
import { SoundManager, MusicTrack } from 'global/SoundManager';
import { Viewport as PixiViewport} from "pixi-viewport";
import Viewport from '../pixi/Viewport';
import { StructureState, StructureStoreState } from 'stores/structure';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import "./css/townView.css"
import { MAX_WIDTH } from 'components/App';
import HitAreaShapes from 'utils/hitAreaShapes';
import polygons from './hitAreas.json';
import LumberMill from './structures/LumberMill';
import Tavern from './structures/Tavern';

const HEIGHT = 1079;
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 1600;

// This might be the town view
// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {

}

export interface Props {
    onStructureClick: (structure: Structure | null) => void;
}


type AllProps = Props & DispatchProps;

const TownView = (props: AllProps) => {

    // let match = useRouteMatch();

    React.useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
        SoundManager.playMusicTrack(MusicTrack.town);
    }, []);

    const handleStructureClick = (structure: Structure | null) => {
        if (!dragging.current && props.onStructureClick) { 
            props.onStructureClick(structure); 
        }
    }

    //console.log('rendering town');

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
            // todo: refactor into seperate components
               
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
                case Structure.weaver:
                    x = 484;
                    y = 333;
                    break;
            }              
            
            switch (structure) {
                case Structure.lumberMill: {
                    return <LumberMill onStructureClick={handleStructureClick} key={structure} />;
                }
                case Structure.tavern: {
                    return <Tavern onStructureClick={handleStructureClick} key={structure} />;
                }
                default: {
                    const hitAreaShapes = new HitAreaShapes(polygons, structure);
                    return <Sprite 
                        key={structure}
                        name={structure}
                        x={x}
                        y={y}
                        interactive={true}
                        buttonMode={true}
                        pointertap={() => {
                            handleStructureClick(structure);
                        }}
                        hitArea={hitAreaShapes}
                        image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}          
                    >
                        {/* <Graphics
                            name="hitarea"
                            draw={graphics => {
                                graphics.beginFill(0xffffff);
                                hitAreaShapes.shapes.map(shape => graphics.drawPolygon(shape))
                                graphics.endFill();
                            }}
                        /> */}
                    </Sprite>
                }
            }

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

        const onScroll = (e: WheelEvent) => {
            // Scrolling the mouse is just used for zoom, not for actual scrolling
            e.preventDefault();
        }
        window.addEventListener("wheel", onScroll, {passive: false} );
        return () => {
            window.removeEventListener("wheel", onScroll);
        };
    }, []);

    const options = {
        sharedLoader: true
    }
    return (
        <div className="town-view">
            <Stage width={MAX_WIDTH} height={HEIGHT} options={options} >
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