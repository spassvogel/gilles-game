import * as React from "react";
import { Stage, Sprite, Text } from '@inlet/react-pixi';
import {  ClickEventData } from "pixi-viewport";
import { Structure, getDefinition } from 'definitions/structures';
import { StructuresStoreState } from 'stores/structures';
import { SoundManager, MusicTrack } from 'utils/soundManager';
import Viewport from '../pixi/Viewport';
import { StructureState, StructureStoreState } from 'stores/structure';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { TextManager } from 'utils/textManager';

const WIDTH = 648;
const HEIGHT = 690;
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 1600;

// This might be the town view
// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {

}

export interface Props {
    onStructureClick?: (structure: Structure | null) => void;
}

interface StateProps {
    structures: StructuresStoreState;
    // tasks: TaskStoreState[];
}

//   let match = useRouteMatch(); 
// https://reacttraining.com/react-router/web/guides/quick-start

// tslint:disable-next-line:no-empty-interface
interface LocalState {}

type AllProps = Props & DispatchProps /*& AppContextProps;*/

const TownView = (props: AllProps) => {

    // let match = useRouteMatch();

    React.useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
        SoundManager.playMusicTrack(MusicTrack.town);
    }, []);

    const handleStructureClick = (structure: Structure) => {
        if (props.onStructureClick) { props.onStructureClick(structure); }
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
            Structure.lumberMill
        ]
        return orderedStructures.reverse().map((structure, index) => {
            const structureStore: StructureStoreState = structures[structure];
            if (structureStore.state === StructureState.NotBuilt) {
                return null;
            }
            const structureDef = getDefinition(structure);
            const levelDef = structureDef.levels[structureStore.level];
            const displayName = TextManager.get(levelDef.displayName);
               
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
            }              
              
            return <Sprite 
                key={structure}
                name={structure}
                x={x}
                y={y}
                interactive
                click={() => {
                    handleStructureClick(structure);
                }}
                image={`${process.env.PUBLIC_URL}/img/town/town-alpha/${structure}.png`}          
            />

            return <Text
                text={displayName}
                x={150}
                y={50 * index}
                // style={
                // new TextStyle({
                //     align: 'center',
                //     fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
                //     fontSize: 50,
                //     fontWeight: 400,
                //     fill: ['#ffffff', '#00ff99'], // gradient
                //     stroke: '#01d27e',
                //     strokeThickness: 5,
                //     letterSpacing: 20,
                //     dropShadow: true,
                //     dropShadowColor: '#ccced2',
                //     dropShadowBlur: 4,
                //     dropShadowAngle: Math.PI / 6,
                //     dropShadowDistance: 6,
                //     wordWrap: true,
                //     wordWrapWidth: 440,
                // })
                // }
            />
        });
    }
    const viewportClick = (event: ClickEventData) => {
        console.log(event.world.x);
    };

    return (
        <Stage width={WIDTH} height={HEIGHT}>
            <Viewport screenWidth={WIDTH} screenHeight={HEIGHT} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} onMount={undefined} onClick={viewportClick} >
                <Sprite 
                    name="background"
                    image={`${process.env.PUBLIC_URL}/img/town/town-alpha/background.png`}          
                >
                    {renderStructures()}
                </Sprite>
            </Viewport>
        </Stage>
    );
}

export default TownView;
