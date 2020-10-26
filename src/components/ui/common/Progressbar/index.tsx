import * as React from "react";
import "./styles/progressbar.scss";

export interface Props {
    progress?: number;     // between 0 and 1
    label?: string;
    className?: string;
}

const Progressbar = (props: Props) => {
    const { className = "" } = props;
    const progress: number = clamp(props.progress || 0, 0, 1);

    return (
        <div className={`progressbar ${className}`}>
            <div className="progressbar-label">{props.label}</div>
            <div className="progressbar-bar" style= {{width: `${progress * 100}%`}}/>
        </div>
    );
};

export default Progressbar;

function clamp(val: number, min: number, max: number): number {
    return val > max ? max : val < min ? min : val;
}
