import { useDispatch } from 'react-redux';
import { subtractGold } from 'actions/gold';
import { upgradeStructure } from 'actions/structures';
import { Structure } from 'definitions/structures';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';

// this hook is not used at the moment
const useStructureActions = () => {
    const dispatch = useDispatch();

    // Unused
    const startUpgradeStructure = (cost: number, level: number, structure: Structure) => {
        dispatch(subtractGold(cost));
        dispatch(upgradeStructure(structure));

        dispatch(addLogText("log-town-upgrade-structure-complete", {
            level,
            structure,
        }, LogChannel.town));
    }

    return {
        startUpgradeStructure //unused
    }
}

export default useStructureActions;