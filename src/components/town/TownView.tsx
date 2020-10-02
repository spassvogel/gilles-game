import React, { useRef, useEffect, useState } from "react";
import { Structure } from 'definitions/structures';
import { StructuresStoreState } from 'stores/structures';
import { SoundManager, MusicTrack } from 'global/SoundManager';
import { useRouteMatch } from 'react-router';
import {OutlineFilter} from '@pixi/filter-outline';
import { getTownLink } from 'utils/routing';
import { StructureState, StructureStoreState } from 'stores/structure';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { gsap } from 'gsap';
import { MAX_WIDTH } from 'components/App';
import HitAreaShapes from 'utils/hitAreaShapes';
import polygons from './hitAreas.json';
import LumberMill from './structures/LumberMill';
import Tavern from './structures/Tavern';
import { withAppContext, AppContextProps } from 'hoc/withAppContext';
import Generic from './structures/Generic';
import Legenda from './Legenda';
import "./styles/townView.scss"
import TownStage from './TownStage';
import { Viewport as PixiViewport } from "pixi-viewport";

const HEIGHT = 1079;
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 1600;

export interface Props {
    onStructureClick: (structure: Structure | null) => void;
}

export const STRUCTURE_HIGHLIGHT_FILTER = new OutlineFilter(8, 0xffcc00);

const TownView = (props: Props & AppContextProps) => {
    const match = useRouteMatch<{structure: string}>(`${getTownLink()}/:structure`);
    const selectedStructure = match?.params.structure;
    const ref = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<PixiViewport>(null);

    useEffect(() => {
        SoundManager.addMusicTrack(MusicTrack.town, "sound/music/Soliloquy.mp3");
        SoundManager.playMusicTrack(MusicTrack.town);
    }, []);

    useEffect(() => {
        const tween = gsap.to(STRUCTURE_HIGHLIGHT_FILTER, {
            duration: .6,
            thickness: 2,
            yoyo: true,
            repeat: -1
        });
        return () => {
            tween.pause(0);
            tween.kill();
        }
    }, []);

    const handleStructureClick = (structure: Structure | null) => {
        if (!dragging.current) {
            // if (structure) {
            //     // history.push(getStructureLink(structure));
            // } else {
            //     // history.push(getTownLink());
            // }
            props.onStructureClick(structure);
        }
    }
    // console.log('rendering town');

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

            const StructureComponent = getStructure(structure);
            const position = getStructurePosition(structure);
            const hitAreaShapes = new HitAreaShapes(polygons, structure);
            return (
                <StructureComponent
                    position={position}
                    structure={structure}
                    hitAreaShapes={hitAreaShapes}
                    onStructureClick={handleStructureClick}
                    key={structure}
                    selected={selectedStructure === structure}
                />
            );
        });
    }

    const dragging = useRef(false);

    useEffect(() => {
        if(viewportRef.current) {
            const viewport = viewportRef.current;
            viewport.on("drag-start", () => { dragging.current = true; });
            viewport.on("drag-end", () => { dragging.current = false; });
            viewport.on("moved", () => {
                // console.log('top:', viewport.top)
                // console.log('bottom:', viewport.bottom)
                const rightFactor = viewport.right / (WORLD_WIDTH );
                console.log('right:', viewport.right, rightFactor)
            })
        }

        const onScroll = (e: WheelEvent) => {
            // Scrolling the mouse is just used for zoom, not for actual scrolling
            e.preventDefault();
        }
        window.addEventListener("wheel", onScroll, {passive: false});
        return () => {
            window.removeEventListener("wheel", onScroll);
        };
    }, []);

    useEffect(() => {
        if (selectedStructure && viewportRef.current) {
            const viewport = viewportRef.current;
            viewport.zoomPercent(0);
            const position = getStructurePosition(Structure[selectedStructure]);
            viewport.moveCenter(position);
        }
    }, [selectedStructure]);

    const [canvasWidth, setCanvasWidth] = useState(MAX_WIDTH);
    const [canvasHeight, setCanvasHeight] = useState(HEIGHT);

    useEffect(() => {
        // This will set the dimensions of the canvas tot that of the townview
        const resize = () => {
            const worldViewWidth = ref.current?.clientWidth || MAX_WIDTH;
            const worldViewHeight = ref.current?.clientHeight || HEIGHT;

            setCanvasWidth(worldViewWidth);
            setCanvasHeight(worldViewHeight);
        }
        resize();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);


    return (
        <div className="town-view" ref={ref}>
            <Legenda structures={structures} />
            <TownStage
                screenWidth={canvasWidth / 2}
                screenHeight={canvasHeight / 2}
                worldWidth={WORLD_WIDTH}
                worldHeight={WORLD_HEIGHT}
                ref={viewportRef}
            >
                {renderStructures()}
            </TownStage>
            {/* { selectedStructure && (
                <StructureDetailsView
                    structure={selectedStructure}
                    title={TextManager.getStructureName(selectedStructure)}
                    onClose={() => handleStructureClick(null)}
                />
            )} */}
        </div>
    );
}

export default withAppContext(TownView);

const getStructure = (structure: Structure) => {
    switch (structure) {
        case Structure.workshop:
        case Structure.quarry:
        case Structure.tannery:
        case Structure.alchemist:
        case Structure.garden:
        case Structure.weaponsmith:
        case Structure.armoursmith:
        case Structure.warehouse:
        case Structure.mine:
        case Structure.weaver:
            return Generic;
        case Structure.lumberMill:
            return LumberMill;
        case Structure.tavern:
            return Tavern;
    }
}

const getStructurePosition = (structure: Structure) => {
    let x;
    let y;
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
        case Structure.tavern:
            x = 500;
            y = 469;
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
        case Structure.lumberMill:
            x = 403;
            y = 320;
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
    return new PIXI.Point(x, y);
}