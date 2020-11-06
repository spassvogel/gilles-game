import * as React from "react";
import { useDelta } from 'hooks/store/engine';
import { useEffect, useRef, useState } from 'react';
import "./styles/progressbar.scss";

export enum Direction {
    increasing,
    decreasing
}

export interface Props {
    progress?: number;     // between 0 and 1
    label?: string;
    className?: string;
    direction?: Direction; // only used to prevent the bar from animating back to the start state
}

const Progressbar = (props: Props) => {
    const { className = "", direction } = props;
    const previousProgress = useRef(0);
    const progress: number = clamp(props.progress || 0, 0, 1);
    // We use the delta time since last tick to animate
    const delta = useDelta();

    // If we have a direction defined and we're going the other direction, dont animate
    // because we've basically reset the progress bar and we just want to animate in one direction
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(
             direction === undefined ||
            (direction === Direction.increasing && progress > previousProgress.current) ||
            (direction === Direction.decreasing && progress < previousProgress.current)
        );
    }, [direction, progress]);


    previousProgress.current = progress;
    return (
        <div className={`progressbar ${className}`}>
            <div className="progressbar-label">{props.label}</div>
            <div className="progressbar-bar" style= {{
                width: `${progress * 100}%`,
                ...(animate && {transition: `width ${delta}ms linear`})
            }}/>
        </div>
    );
};

export default Progressbar;

function clamp(val: number, min: number, max: number): number {
    return val > max ? max : val < min ? min : val;
}
