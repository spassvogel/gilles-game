// Todo: come up with a less retarded name
import * as React from 'react';
import './css/updownvalue.css';

export interface DispatchProps {
    onUp?: () => void
    onDown?: () => void
}
export interface Props extends DispatchProps {
    label?: string,
    value?: number;
    max?: number;
    upDisabled?: boolean;
    downDisabled?: boolean;
}

export default function(props: Props) {
    const handleUp = () => {
        if(props.onUp && !props.upDisabled) props.onUp();
    }

    const handleDown= () => {
        if(props.onDown && !props.downDisabled) props.onDown();
    }

    let displayValue;
    if(props.max == null) {
        displayValue = props.value;
    } 
    else {
        displayValue = <span> 
            	{ props.value } / <span className='max'>{ props.max }</span>
            </span>;
    }
    return ( 
        <div className="updownvalue">
            <label> { props.label }</label>
            { displayValue }
            <i className= { "arrow up" + (props.upDisabled ? " disabled" : "" )}
                onClick= { handleUp }
            ></i>
            <i className={"arrow down" + (props.downDisabled ? " disabled" : "")}
                onClick= { handleDown }
            ></i>
        </div>
    );
}

