import * as React from "react";
import "./css/progressbar.css";

export interface Props {
    progress?: number;     // between 0 and 1
    label?: string;
}

const Progressbar = (props: Props) => {
    const progress: number = clamp(props.progress || 0, 0, 1);

    return (
        <div className="progressbar">
            <div className="progressbar-label">{props.label}</div>
            <div className="progressbar-bar" style= {{width: `${progress * 100}%`}}></div>
        </div>
    );
};

export default Progressbar;

function clamp(val: number, min: number, max: number): number {
    return val > max ? max : val < min ? min : val;
}
