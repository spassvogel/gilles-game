
import * as React from "react";
import { Equipment } from "src/definitions/equipment/types";

export interface StateProps {
    amount: number;
}

export interface Props {
    type: Equipment;
}

export default function(props: Props & StateProps) {
    return (
        <div>
            <label>{ props.type }: </label>
            { props.amount }
        </div>
    );
}
