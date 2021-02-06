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
    animationTime?: number;
}

const PlainProgressbar = (props: Props) => {
    const { className = "", animationTime } = props;
    const previousProgress = useRef(0);
    const progress: number = clamp(props.progress || 0, 0, 1);

    previousProgress.current = progress;
    return (
        <div className={`progressbar ${className}`}>
            <div className="progressbar-label">{props.label}</div>
            <div className="progressbar-bar" style= {{
                width: `${progress * 100}%`,
                ...(animationTime && {transition: `width ${animationTime}ms linear`})
            }}/>
        </div>
    );
};

export default PlainProgressbar;

function clamp(val: number, min: number, max: number): number {
    return val > max ? max : val < min ? min : val;
}
