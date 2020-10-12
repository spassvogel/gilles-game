import * as React from "react";
import { TextManager } from 'global/TextManager';
import { subtractGold } from 'actions/gold';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';
import { getDefinition, Structure } from 'definitions/structures';
import useGoldState from 'hooks/store/useGoldState';
import { useDispatch } from 'react-redux';
import { upgradeStructure } from 'actions/structures';
import useStructureState from 'hooks/store/useStructureState';
import Button from 'components/ui/buttons/Button';
import { startTask } from 'actions/tasks';
import { TaskType } from 'stores/task';
import { useUpgradeTasksStateByStructure } from 'hooks/store/useTasksState';
import Progressbar from 'components/ui/Progressbar';
import { formatDuration } from 'utils/format/time';

export interface Props {
    structure: Structure;
}

const UpgradeStructureButton = (props: Props) => {
    const {structure} = props;
    const dispatch = useDispatch();
    const gold = useGoldState();

    const structureState = useStructureState(structure);
    const level: number = structureState.level;
    const structureDefinition = getDefinition(props.structure);

    const nextLevel = structureDefinition.levels[level + 1];
    const nextLevelCost = (nextLevel != null ? nextLevel.cost.gold || 0 : -1);
    const canUpgrade = nextLevel != null && gold >= nextLevelCost;
    const upgradeText = nextLevel == null ? TextManager.get("ui-structure-upgrade-max") : TextManager.get("ui-structure-upgrade", { cost: nextLevelCost, level: level + 2 });

    const upgradeTasks = useUpgradeTasksStateByStructure(structure);

    const handleUpgrade = (cost: number) => {
        dispatch(subtractGold(cost));

        const callbacks = [
            upgradeStructure(structure),
            addLogText("log-town-upgrade-structure-complete", {
                level: level + 1,
                structure,
            }, LogChannel.town)
        ];
        const time = nextLevel.cost.time!;
        const start = startTask(TaskType.upgradeStructure,
            `${structure}.upgrade`,
            "town",
            time,
            callbacks);
        dispatch(start);
    }

    if (upgradeTasks.length) {
        const t = upgradeTasks[0];
        return (
            <Progressbar
                key={`${t.name}${t.startTime}`}
                label={`${TextManager.get("structure-upgrade-button-upgrading")} (${formatDuration(t.timeRemaining)})`}
                progress={t.progress}
            />
        )
    }

    return (
        <div>
            <label>{TextManager.get("ui-structure-level")}</label>
            { `${(level + 1)} / ${structureDefinition.levels.length}` }
            <Button
                className="upgrade"
                onClick={() => {handleUpgrade(nextLevelCost)}}
                disabled={!canUpgrade}>
                    { upgradeText }
            </Button>
        </div>
    );
};

export default UpgradeStructureButton;