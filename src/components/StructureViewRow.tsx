// OBSOLETE
import * as React from 'react';
import './css/structureviewrow.css';

export interface DispatchProps {
    onChange?: (amount:number) => void
}

export interface Props extends DispatchProps {
    name: string;
    amount?: number;
}
  

export default function(props: Props) {  
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(props.onChange) props.onChange(parseInt(event.currentTarget.value));
    }

    return ( 
        <div className="structure-view-row">
            <label>{ props.name } </label>
            <input type="number" 
                value={props.amount} 
                onChange={handleChange}
                min={0}
                max={100}
            ></input>
        </div>
    );
}


