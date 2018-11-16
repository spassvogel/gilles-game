
import * as React from 'react';

export interface Props {
  name: string;
  amount?: number;
}

function ResourceViewRow({ name, amount = 1 }: Props) {  
    const display = name + ":" + amount
    return ( 
        <div>
            { display}
        </div>
    );
}

export default ResourceViewRow;

// helpers

