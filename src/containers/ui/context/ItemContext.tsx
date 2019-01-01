
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { setStructureState } from "src/actions/structures";
import { startTask } from "src/actions/tasks";
import ItemContext, { DispatchProps, Props, StateProps } from "src/components/ui/context/ItemContext";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StoreState } from "src/stores";
import { StructureState } from "src/stores/structure";
import { TaskType } from "src/stores/task";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        gold: store.gold,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {

        handleStartConstruction: (structure: Structure) => {
            dispatch(setStructureState(structure, StructureState.Building));

            const callback = setStructureState(structure, StructureState.Built);
            const structureDefinition = structureDefinitions[structure];
            const time = structureDefinition.buildTime;
            const start = startTask(TaskType.buildStructure,
                `${structure}.build`,
                "town",
                time,
                callback);
            dispatch(start);
        },
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(ItemContext);
