import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction, compose } from "redux";
import { subtractGold } from "actions/gold";
import { addLogEntry } from "actions/log";
import { launchQuest } from "actions/quests";
import { upgradeStructure } from "actions/structures";
import TavernStructureView, { DispatchProps, Props, StateProps } from "components/structures/tavern/TavernStructureView";
import { Structure } from "definitions/structures";
import { withAppContext } from "hoc/withAppContext";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { LogChannel } from "stores/logEntry";
import { StructureStoreState } from "stores/structure";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    const structureStore: StructureStoreState = store.structures[Structure.tavern];
    return {
        adventurers: store.adventurers,
        gold: store.gold,
        level: structureStore.level,
        quests: store.quests,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {
        onLaunchQuest: (questName: string, assignedAventurers: AdventurerStoreState[]) => {
            dispatch(launchQuest(questName, assignedAventurers));
        },
        onUpgrade: (cost: number, level: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(Structure.tavern));  // Todo: [07/07/2019] time??

            level++;
            dispatch(addLogEntry("log-town-upgrade-structure-complete", LogChannel.town, {
                level,
                structure: Structure.tavern,
            }));
        },
    };
}

// todo: I'm not sure if this Container needs an AppContext. If not. remove it later
export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(TavernStructureView);
