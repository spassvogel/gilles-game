import { Dispatch } from "react";
import { connect } from "react-redux";
import { AnyAction, compose } from "redux";
import { subtractGold } from "src/actions/gold";
import { launchQuest } from "src/actions/quests";
import { upgradeStructure } from "src/actions/structures";
import TavernStructureView, { DispatchProps, Props, StateProps } from "src/components/structures/tavern/TavernStructureView";
import { Structure } from "src/definitions/structures";
import { withAppContext } from "src/hoc/withAppContext";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { StructureStoreState } from "src/stores/structure";

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
        onUpgrade: (cost: number) => {
            dispatch(subtractGold(cost));
            dispatch(upgradeStructure(Structure.tavern));  // Todo: [07/07/2019] time??
        },
    };
}

// todo: I'm not sure if this Container needs an AppContext. If not. remove it later
export default compose(
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
    withAppContext,
)(TavernStructureView);
