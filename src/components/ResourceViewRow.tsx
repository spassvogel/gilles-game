
import * as React from 'react';
import { ResourceType } from 'src/definitions/resources';

export interface Props {
  type: ResourceType;
  name?: string,
  amount?: number;
}

export default function({ name, amount = 1 }: Props) {  
    return ( 
        <div>
            <label> { name }</label>
            { amount }
        </div>
    );
}

