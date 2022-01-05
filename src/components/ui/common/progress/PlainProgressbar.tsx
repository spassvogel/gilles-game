import React, { useRef } from 'react';
import { clamp } from 'utils/math';
import './styles/progressbar.scss';

export enum Direction {
  increasing,
  decreasing,
}

export interface Props {
  progress?: number;     // between 0 and 1
  label?: string;
  className?: string;
  direction?: Direction; // only used to prevent the bar from animating back to the start state
  animationTime?: number;
  variation?: 'normal' | 'health'
}

const PlainProgressbar = (props: Props) => {
  const { className = '', animationTime, variation = 'normal' } = props;
  const previousProgress = useRef(0);
  const progress: number = clamp(props.progress || 0, 0, 1);

  previousProgress.current = progress;
  return (
        <div className={`progressbar progressbar--variation-${variation} ${className}`}>
            <div className="progressbar-label">{props.label}</div>
            <div className="progressbar-bar" style={{
              width: `${progress * 100}%`,
              ...(animationTime && { transition: `width ${animationTime}ms linear` }),
            }}/>
        </div>
  );
};

export default PlainProgressbar;

