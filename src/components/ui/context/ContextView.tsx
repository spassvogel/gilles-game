
import { ContextInfo, ContextType } from "constants/context";
import ItemContext from "containers/ui/context/ItemContext";
import { Item, ItemType } from "definitions/items/types";
import { PopupProps, withPopup } from "hoc/withPopup";
import * as React from "react";
import { TextManager } from "utils/textManager";
import "./css/contextview.css";

export interface Props {
    type: ContextType | null;
    info: ContextInfo | null;
}

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps {
}

type AllProps = Props & DispatchProps & PopupProps;
/**
 * The ContextView shows the player contextual information about the item she clicked
 * @param props
 */
class ContextView extends React.Component<AllProps> {

    constructor(props: AllProps) {
        super(props);
    }

    public render() {
        let { info } = this.props;
        const { type } = this.props;

        if (!info) {
            info = {
                item: Item.deedForWeaponsmith,
                itemType: ItemType.weapon,
                subText: "It allows for the construction of a weaponsmith",
                iconImg: "/img/items/deeds/deed.png",
            };
        }
        let content;

        switch (type) {
            case ContextType.item:
            default:
                content = <ItemContext info= { info } />;
        }

        const name = TextManager.getItemName(info.item);
        return <fieldset className="contextbox">
            <legend> { name } </legend>
            { content }
        </fieldset>;
    }

    public componentDidUpdate() {
    //    // console.log(this.containerRef.current)
    //     //console.log(this.props.origin)

    //     if (this.containerRef.current && this.props.origin) {
    //        // var rect = (this.props.origin as HTMLElement).getBoundingClientRect();
    //        // console.log(rect)
    //         const reference = this.props.origin as Element;

    //         const popperInstance = new Popper(reference, this.containerRef.current
    //             // popper options here
    //         );
    //     }
    }
}

export default withPopup<AllProps>(ContextView);
