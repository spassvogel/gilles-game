
import * as React from 'react';
import { Equipment } from 'src/definitions/equipment';

export interface Props {
    type:Equipment
    amount?:number;
}

export default function(props: Props) {  
    return ( 
        <div>
            <label>{ props.type }: </label>
            { props.amount || 0}
        </div>
    );
}

