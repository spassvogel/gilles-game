
import * as React from "react";
import { Item } from "src/definitions/items/types";

export interface StateProps {
    amount: number;
}

export interface Props {
    type: Item;
}

export default function(props: Props & StateProps) {
    return (
        <div>
            <label>{ props.type }: </label>
            { props.amount }
        </div>
    );
}
