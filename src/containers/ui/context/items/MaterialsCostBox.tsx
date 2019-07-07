import { connect } from "react-redux";
import ItemsBox, { Props, StateProps } from "src/components/ui/items/ItemsBox";
import { Item } from "src/definitions/items/types";
import { StoreState } from "src/stores";

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
