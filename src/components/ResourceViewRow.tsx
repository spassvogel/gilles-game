
import * as React from "react";
import { Resource } from "src/definitions/resources";

export interface Props {
  type: Resource;
  name?: string;
  amount?: number;
}

export default function({ name, amount = 1 }: Props) {
    return (
        <div>
            <label> { name }</label>
            { amount.toFixed() }
        </div>
    );
}
