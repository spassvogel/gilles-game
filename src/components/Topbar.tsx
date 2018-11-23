
import * as React from 'react';
import './css/topbar.css';

export interface Props  {
    gold: number;
}
  

export default function(props: Props) {  
    
    return ( 
        <div className="topbar">
            gold: <b>{ props.gold }</b>
        </div>
    );
}


