import ItemsBox, { Props, StateProps } from "components/ui/items/ItemsBox";
import { Item } from "definitions/items/types";
import { connect } from "react-redux";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    const itemsInInventory: Item[] = [];
    ownProps.items.forEach((item: Item) => {
        if (store.items.indexOf(item) > -1) {
            itemsInInventory.push(item);
        }
    });
    return {
        itemsInInventory,
    };
};

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)
    (ItemsBox);
