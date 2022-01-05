import { TickingProgressbar } from 'components/ui/common/progress';
import { Direction } from 'components/ui/common/progress/TickingProgressbar';
import { Structure } from 'definitions/structures';
import { TextManager } from 'global/TextManager';
import { useEngine } from 'hooks/store/engine';
import { HARVEST_INTERVAL } from 'mechanics/gameTick/harvest';
import { formatDuration } from 'utils/format/time';
import IconButton from 'components/ui/buttons/IconButton';
import { useDispatch } from 'react-redux';
import { reduceTime } from 'store/actions/game';
import './styles/harvestProgress.scss';

interface Props {
  structure: Structure;
}

const HarvestProgress = (props: Props) => {
  const { structure } = props;
  const engine = useEngine();
  const dispatch = useDispatch();
  const delta = HARVEST_INTERVAL - (Date.now() - engine.lastHarvest);

  const handleReduceTime50 = () => {
    dispatch(reduceTime(50, 'harvest', structure));
  };

  return (
    <div className="harvest-progress">
      <TickingProgressbar
         className="harvest-progress"
         direction={Direction.decreasing}
         label={`${TextManager.get('ui-structure-resource-next-harvest', {
           time: formatDuration(delta),
         })}`}
         progress={delta / HARVEST_INTERVAL}
      />
      <IconButton iconImg="/img/ui/misc/clock.png" size="smallest" onClick={handleReduceTime50}> 50%</IconButton>
    </div>
  );
};

export default HarvestProgress;
