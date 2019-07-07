// Deprecated
import * as React from "react";
import { Resource } from "src/definitions/resources";
import { capitalizeFirstLetter } from "src/utils/string";
import { TextManager } from "src/utils/textManager";

export interface Props {
  type: Resource;
  amount?: number;
}

const ResourceViewRow = ({ amount = 0, type }: Props) => {
    const name = TextManager.getResourceName(type);
    return (
        <div>
            <label> { capitalizeFirstLetter(name) }</label>
            { amount.toFixed() }
        </div>
    );
};

export default ResourceViewRow;
