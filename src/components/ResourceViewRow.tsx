
import * as React from "react";
import { Resource } from "src/definitions/resources";
import { TextManager } from "src/utils/textManager";
import { capitalizeFirstLetter } from "src/utils/string";

export interface Props {
  type: Resource;
  amount?: number;
}

export default function({ amount = 0, type }: Props) {
    const name = TextManager.get(`resource-${type}-name`);
    return (
        <div>
            <label> { capitalizeFirstLetter(name) }</label>
            { amount.toFixed() }
        </div>
    );
}
