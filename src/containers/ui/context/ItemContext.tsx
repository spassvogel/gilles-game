
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { finishBuildingStructure, startBuildingStructure } from "src/actions/structures";
import { startTask } from "src/actions/tasks";
import ItemContext, { DispatchProps, Props, StateProps } from "src/components/ui/context/ItemContext";
import structureDefinitions, { Structure } from "src/definitions/structures";
import { StoreState } from "src/stores";
import { TaskType } from "src/stores/task";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        store,
    };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>, ownProps: Props): DispatchProps {
    return {

        handleStartConstruction: (structure: Structure) => {
            dispatch(startBuildingStructure(structure));

            const callbacks = [ finishBuildingStructure(structure) ];
            const structureDefinition = structureDefinitions[structure];
            const time = structureDefinition.buildTime;
            const start = startTask(TaskType.buildStructure,
                `${structure}.build`,
                "town",
                time,
                callbacks);
            dispatch(start);
        },
    };
}

export default connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps)(ItemContext);
