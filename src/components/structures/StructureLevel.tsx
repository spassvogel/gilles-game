import * as React from "react";
import { TextManager } from 'global/TextManager';
import { Structure } from 'definitions/structures';
import { useStructureDefinition, useStructureState } from 'hooks/store/structures';
import Button from 'components/ui/buttons/Button';
import { useUpgradeTasksStateByStructure } from 'hooks/store/useTasksState';
import { formatDuration } from 'utils/format/time';
import { TickingProgressbar } from "components/ui/common/progress";
import { reduceTime } from "store/actions/game";
import { useDispatch } from "react-redux";
import IconButton from "components/ui/buttons/IconButton";
import "./styles/structureLevel.scss";

export interface Props {
  structure: Structure;
  onHelpClicked?: (e: React.MouseEvent) => void;
}

const StructureLevel = (props: Props) => {
  const {
    structure,
    onHelpClicked,
  } = props;
  const dispatch = useDispatch();
  const structureState = useStructureState(structure);
  const level: number = structureState.level;
  const structureDefinition = useStructureDefinition(structure);

  const nextLevel = structureDefinition.levels[level + 1];
  const upgradeText = nextLevel == null ? TextManager.get("ui-structure-upgrade-max") : TextManager.get("ui-structure-upgrade", { level: level + 2 });

  const upgradeTasks = useUpgradeTasksStateByStructure(structure);
  const handleReduceTime50 = () => {
    if (!upgradeTasks.length) return;
    dispatch(reduceTime(50, "task", upgradeTasks[0].name))
  }

  if (upgradeTasks.length) {
    const t = upgradeTasks[0];
    return (
      <div className="upgrade-progress-container">
        <TickingProgressbar
          key={`${t.name}${t.startTime}`}
          className="upgrading"
          label={`${TextManager.get("structure-upgrade-button-upgrading")} (${formatDuration(t.timeRemaining)})`}
          progress={t.progress}
        />
        <IconButton iconImg="/img/ui/misc/clock.png" size="smallest" onClick={handleReduceTime50}>50%</IconButton>
      </div>
    )
  }

  return (
    <div className="upgrade-stucture-button">
      <label>
        {TextManager.get("ui-structure-level")}
        { level + 1 }
      </label>
      <Button
        className="upgrade"
        onClick={onHelpClicked}
        disabled={nextLevel == null}
      >
        { upgradeText }
      </Button>
    </div>
  );
};

export default StructureLevel;
