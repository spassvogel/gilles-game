import * as React from "react";
import { AnyAction } from "redux";
import { TextManager } from 'global/TextManager';
import { subtractGold } from 'store/actions/gold';
import { addLogText } from 'store/actions/log';
import { LogChannel } from 'store/types/logEntry';
import { getDefinition, Structure } from 'definitions/structures';
import useGoldState from 'hooks/store/useGoldState';
import { useDispatch } from 'react-redux';
import { upgradeStructure } from 'store/actions/structures';
import { useStructureState } from 'hooks/store/structures';
import Button from 'components/ui/buttons/Button';
import { startTask } from 'store/actions/tasks';
import { TaskType } from 'store/types/task';
import { useUpgradeTasksStateByStructure } from 'hooks/store/useTasksState';
import { formatDuration } from 'utils/format/time';
import { TickingProgressbar } from "components/ui/common/progress";
import "./styles/structureLevel.scss";

export interface Props {
    structure: Structure;
    onHelpClicked?: (e: React.MouseEvent) => void;
    addUpgradeCallbacks?: (level: number) => AnyAction[]; // add custom actions after upgrade is done
}

const StructureLevel = (props: Props) => {
    const {
        structure,
        onHelpClicked,
        addUpgradeCallbacks
    } = props;
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
            ...(addUpgradeCallbacks?.(level + 1) || []),
            upgradeStructure(structure),
            addLogText("log-town-upgrade-structure-complete", {
                level: level + 1,
                structure,
            }, LogChannel.town)
        ];
        const time = nextLevel.cost.time ?? 0;
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
            <TickingProgressbar
                key={`${t.name}${t.startTime}`}
                className="upgrading" // todo: margin: 8
                label={`${TextManager.get("structure-upgrade-button-upgrading")} (${formatDuration(t.timeRemaining)})`}
                progress={t.progress}
            />
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
                onClick={() => {handleUpgrade(nextLevelCost)}}
                disabled={!canUpgrade}>
                    { upgradeText }
            </Button>
            { nextLevel != null && (
                <Button className="help" square={true} onClick={onHelpClicked}>
                    ?
                </Button>
            )}
        </div>
    );
};

export default StructureLevel;