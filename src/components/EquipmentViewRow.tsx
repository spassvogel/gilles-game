
import * as React from 'react';
import { ResourceStoreState } from 'src/stores/resources';

export interface Props {
  name: string;
  amount?: number;
  requirements: ResourceStoreState
}

const makeRequirementString = (requirements: ResourceStoreState) : string => {
    return Object.keys(requirements).reduce((accumulator:Array<string>, value) => {
        if(requirements[value]) accumulator.push(`${value}: ${requirements[value]}`);
        return accumulator;
    }, []).join(', ');
} 

export default function(props: Props) {  
    const title = "Requires: " + makeRequirementString(props.requirements);
    return ( 
        <div>
            <label>{ props.name } </label>
            { props.amount }
            <button title={ title}>craft</button>
        </div>
    );
}

