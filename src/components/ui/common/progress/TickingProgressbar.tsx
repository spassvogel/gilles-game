import * as React from "react";
import { useDelta } from 'hooks/store/engine';
import { useEffect, useState } from 'react';
import PlainProgressbar from "./PlainProgressbar";
import usePrevious from "hooks/usePrevious";

export enum Direction {
    increasing,
    decreasing
}

export interface Props {
    progress: number;     // between 0 and 1
    label?: string;
    className?: string;
    direction?: Direction; // only used to prevent the bar from animating back to the start state
    animate?: boolean;
}

const TickingProgressbar = (props: Props) => {
    const { className = "", label, direction, progress = 0} = props;
    const previousProgress = usePrevious(progress) || 0;
    // We use the delta time since last tick to animate
    const delta = useDelta();

    // If we have a direction defined and we're going the other direction, dont animate
    // because we've basically reset the progress bar and we just want to animate in one direction
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(
             direction === undefined ||
            (direction === Direction.increasing && progress > previousProgress) ||
            (direction === Direction.decreasing && progress < previousProgress)
        );
    }, [direction, progress]); // see https://github.com/facebook/react/issues/20752

    // previousProgress.current = progress;
    return (
        <PlainProgressbar
            progress={progress}
            label={label}
            className={className}
            animationTime={animate ? delta : 0}
        />
    );
};

export default TickingProgressbar;
