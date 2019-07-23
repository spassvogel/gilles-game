// TODO: Better name than this

import { getDefinition } from "definitions/items";
import { Item, ItemType } from "definitions/items/types";
import structureDefinitions, { Structure  } from "definitions/structures";
import * as React from "react";
import { ResourceStoreState } from "stores/resources";
import { StructureState, StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";
import { TextManager } from "utils/textManager";
import "./css/cheatbox.css";
import { withWindow } from "hoc/withWindow";
import { Props as WindowProps } from "components/ui/window/Window";
import { compose } from "redux";
import { withAppContext } from "hoc/withAppContext";

export interface DispatchProps {
}

export interface StateProps {
}

// tslint:disable-next-line:no-empty-interface
export interface Props {
}

interface LocalState {
}

type AllProps = Props & StateProps & DispatchProps & WindowProps;
class Menu extends React.Component<AllProps, LocalState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
        };
    }

    public render() {

       return (
            <div className="menu">
                asb
            </div>
        );
    }

}

export default compose(
    withWindow,
    withAppContext,
)(Menu) as React.ComponentType<AllProps>;
