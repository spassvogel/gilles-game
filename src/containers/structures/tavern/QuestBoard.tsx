import QuestBoard, { Props, StateProps } from "components/structures/tavern/QuestBoard";
import { connect } from "react-redux";
import { StoreState } from "stores";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    return {
        items: store.items,
    };
}

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)(QuestBoard);
