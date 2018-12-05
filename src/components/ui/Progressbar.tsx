import * as React from "react";
import "./css/progressbar.css";

// tslint:disable-next-line:no-empty-interface
export interface DispatchProps { }
export interface Props extends DispatchProps {
    progress?: number;     // between 0 and 1
    label?: string;
}

export default function(props: Props) {
    const progress: number = clamp(props.progress || 0, 0, 1);

    return (
        <div className="progressbar">
            <div className="progressbar-label">{ props.label }</div>
            <div className="progressbar-info" style= {{ width: `${progress * 100}%`}}>  </div>
        </div>
    );
}

function clamp(val: number, min: number, max: number): number {
    return val > max ? max : val < min ? min : val;
}
