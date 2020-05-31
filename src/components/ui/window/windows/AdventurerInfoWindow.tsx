// obsolete, remove!
import AdventurerInfo, { DispatchProps, Props, StateProps } from "components/ui/AdventurerInfo";
import { Props as WindowProps } from "components/ui/window/Window";
import { mapDispatchToProps } from "containers/ui/AdventurerInfo";
import { withWindow } from "hoc/withWindow";
import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { StoreState } from "stores";

type AllProps = Props & WindowProps;

// todo: perhaps not use container, just pass dispatch callbacks as props?
const mapStateToProps = (store: StoreState, ownProps: Props) => {

    const adventurer = store.adventurers.find((a) => a.id === ownProps.adventurerId)!;
    return {
        adventurer,
        warehouse: store.stockpile,
    };
};

export default compose(
    withWindow,
    connect<StateProps, DispatchProps, Props, StoreState>(mapStateToProps, mapDispatchToProps),
)(AdventurerInfo) as React.ComponentType<AllProps>;