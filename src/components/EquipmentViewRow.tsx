
import * as React from 'react';

export interface Props {
  name: string;
  amount?: number;
}

export default function(props: Props) {  
    return ( 
        <div>
            <label>{ props.name }: </label>
            { props.amount || 0}
        </div>
    );
}

