
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { finishBuildingStructure, startBuildingStructure } from "actions/structures";
import { startTask } from "actions/tasks";
import ItemContext, { DispatchProps, Props, StateProps } from "components/ui/context/ItemContext";
import structureDefinitions, { Structure } from "definitions/structures";
import { StoreState } from "stores";
import { TaskType } from "stores/task";

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
            const time = structureDefinition.cost.time!;
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
