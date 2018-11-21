
import * as React from 'react';

export interface Props {
  name: string;
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

