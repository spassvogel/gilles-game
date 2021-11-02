import * as React from "react";
import { PropsWithChildren } from 'react';
import './styles/button.scss';

export enum ButtonSize {
  auto, // will select either medium or small, depending on screen size
  large,
  medium,
  small,
}

export enum ButtonColor {
  blue = "blue",
  purple = "purple",
  green = "green"
}

export type Props = PropsWithChildren<{
  text?: string;
  color?: ButtonColor | keyof typeof ButtonColor; // Can use enum or string
  size?: ButtonSize | keyof typeof ButtonSize; // Can use enum or string
  className?: string;
  disabled?: boolean;
  square?: boolean;
  onClick?: React.MouseEventHandler<Element>;
}>


const Button = (props: React.ComponentProps<'button'> & Props) => {
  const { color, square, text, ...otherProps } = props;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e)
  };

  const className = [
    'button',
    (props.className ?? ""),
    `button-${typeof color === "string" ? color : ButtonColor[color ?? ButtonColor.blue]}`,
    `button-${typeof props.size === "string" ? props.size : ButtonSize[props.size ?? ButtonSize.auto]}`,
    `${square ? "button-square" : ''}`
  ]

  return (
    <button
      {...otherProps}
      className={className.join(' ')}
      onClick={handleClick}
    >
      <span>
        {!!text && text}
        {!text && props.children}
      </span>
    </button>
  );
};

export default Button;
