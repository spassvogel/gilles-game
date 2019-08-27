import ItemsBox, { Props, StateProps } from "components/ui/items/ItemsBox";
import { Item } from "definitions/items/types";
import { connect } from "react-redux";
import { StoreState } from "stores";

const mapStateToProps = (store: StoreState, ownProps: Props): StateProps => {
    const itemsInInventory: Item[] = [];
    const tmpWarehouse = [ ...store.items];
    ownProps.items.forEach((item: Item) => {
        const found = tmpWarehouse.findIndex((i) => i === item);
        if (found > -1) {
            // Remove the item from tmpWarehouse and add to itemsInInventory
            const [ removed ] = tmpWarehouse.splice(found, 1);
            if (removed) {
                itemsInInventory.push(removed);
            }
        }
    });
    return {
        itemsInInventory,
    };
};

export default connect<StateProps, null, Props, StoreState>(mapStateToProps)(ItemsBox);
