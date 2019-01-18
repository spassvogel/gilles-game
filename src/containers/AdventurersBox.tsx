import { connect } from "react-redux";
import { StoreState } from "src/stores";
import AdventurersBox, { Props, StateProps } from "src/components/AdventurersBox";

function mapStateToProps(store: StoreState, ownProps: Props): StateProps {
    
    const { adventurers, parties } = store;
    return {
        adventurers,
        parties
    };
}

export default connect<StateProps, any, Props, StoreState>(mapStateToProps)(AdventurersBox);

