import { useDispatch } from 'react-redux';
import { subtractGold } from 'actions/gold';
import { upgradeStructure } from 'actions/structures';
import { Structure } from 'definitions/structures';
import { addLogText } from 'actions/log';
import { LogChannel } from 'stores/logEntry';


const useStructureActions = () => {
    const dispatch = useDispatch();

    const startUpgradeStructure = (cost: number, level: number, structure: Structure) => {
        dispatch(subtractGold(cost));
        dispatch(upgradeStructure(structure)); // Todo: [07/07/2019] time??

        dispatch(addLogText("log-town-upgrade-structure-complete", {
            level,
            structure,
        }, LogChannel.town));
    }

    return {
        startUpgradeStructure
    }
}

export default useStructureActions;