import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Structure } from 'definitions/structures';
import { StructuresStoreState } from 'store/types/structures';
import { SoundManager, Channel, MixMode } from 'global/SoundManager';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { OutlineFilter } from '@pixi/filter-outline';
import { getStructureLink, getTownLink } from 'utils/routing';
import { StructureState, StructureStoreState } from 'store/types/structure';
import { Viewport as PixiViewport } from 'pixi-viewport';
import { StoreState } from 'store/types';
import { gsap } from 'gsap';
import { MAX_WIDTH } from 'components/App';
import HitAreaShapes from 'utils/pixiJs/hitAreaShapes';
import polygons from '../hitAreas.json';
import { withAppContext } from 'hoc/withAppContext';
import TownStage from '../TownStage';
import Clouds from '../Clouds';
import RoutedStructureDetailsView from '../StructureDetailsView';
import StructureLabels from '../StructureLabels';
import { getStructure, getStructurePosition } from './utils';
import './styles/townView.scss';

const HEIGHT = 1079;
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 1600;


export const STRUCTURE_HIGHLIGHT_FILTER = new OutlineFilter(8, 0xffcc00);

const TownView = () => {
  const hightlightMatch = useRouteMatch<{ structure: string }>(`${getTownLink()}/:structure`);
  const viewMatch = useRouteMatch<{ structure: string }>(`${getTownLink()}/:structure/view`);
  const selectedStructure = hightlightMatch?.params.structure;
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<PixiViewport>(null);
  const dragging = useRef(false);
  const history = useHistory();

  useEffect(() => {
    SoundManager.addSound('music/town', 'sound/music/Soliloquy.mp3', () => {
      SoundManager.playSound('music/town', Channel.music, true, MixMode.fade, true);
    });
  }, []);

  useEffect(() => {
    const tween = gsap.to(STRUCTURE_HIGHLIGHT_FILTER, {
      duration: .6,
      thickness: 2,
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.pause(0);
      tween.kill();
    };
  }, []);

  useEffect(() => {
    if (viewportRef.current) {

      const viewport = viewportRef.current;
      viewport.on('drag-start', (e) => {
        dragging.current = true;
        e.event.stopPropagation();
      });
      viewport.on('drag-end', () => { dragging.current = false; });
    }
  }, []);

  const handleStructureClick = (structure: Structure | null) => {
    if (!dragging.current && structure) {
      SoundManager.playSound('ui/buttonClick');
      history.push(getStructureLink(structure));
    }
  };

  const structures = useSelector<StoreState, StructuresStoreState>((state: StoreState) => {
    return state.structures;
  });

  const renderStructures = () => {
    const orderedStructures: Structure[] = [
      'workshop',
      'quarry',
      'tavern',
      'tannery',
      'alchemist',
      'garden',
      'weaponsmith',
      'armoursmith',
      'warehouse',
      'mine',
      'lumberMill',
      'weaver',
    ];
    return orderedStructures.reverse().map((structure) => {
      const structureStore: StructureStoreState = structures[structure];
      if (structureStore.state === StructureState.NotBuilt) {
        return null;
      }
      // todo: refactor into seperate components

      const StructureComponent = getStructure(structure);
      const position = getStructurePosition(structure);
      const hitAreaShapes = new HitAreaShapes(polygons, structure as string);
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
  };

  useEffect(() => {
    if (selectedStructure && viewportRef.current) {
      const viewport = viewportRef.current;
      viewport.zoomPercent(0);
      const position = getStructurePosition(selectedStructure as Structure);
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
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      window.scrollY = 0;
    };
  }, []);


  return (
    <div className="town-view" ref={ref}>
      {/* <Legenda structures={structures} /> */}
      { viewMatch === null && (
        <TownStage
          screenWidth={canvasWidth}
          screenHeight={canvasHeight}
          worldWidth={WORLD_WIDTH}
          worldHeight={WORLD_HEIGHT}
          ref={viewportRef}
          blockScroll={viewMatch === null}
        >
          <Clouds worldWidth={canvasWidth} />
          {renderStructures()}
          <Clouds worldWidth={canvasWidth} />
          <StructureLabels />
        </TownStage>
      )}
      <Switch>
        <Route path="/town/:structure/view" >
          <RoutedStructureDetailsView />
        </Route>
      </Switch>
    </div>
  );
};

export default withAppContext(TownView);
