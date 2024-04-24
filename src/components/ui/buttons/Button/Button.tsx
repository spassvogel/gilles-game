import * as React from 'react'
import { type PropsWithChildren } from 'react'

import './styles/button.scss'

export enum ButtonSize {
  auto, // will select either medium or small, depending on screen size
  large,
  medium,
  small,
}

export enum ButtonColor {
  blue = 'blue',
  green = 'green',
  purple = 'purple',
  red = 'red'
}

export type Props = PropsWithChildren<{
  color?: ButtonColor | keyof typeof ButtonColor // Can use enum or string
  size?: ButtonSize | keyof typeof ButtonSize // Can use enum or string
  className?: string
  disabled?: boolean
  square?: boolean
  onClick?: React.MouseEventHandler<Element>
}>

const Button = (props: React.ComponentProps<'button'> & Props) => {
  const { color, square, ...otherProps } = props

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(e)
  }

  const className = [
    'button',
    (props.className ?? ''),
    `button-${typeof color === 'string' ? color : ButtonColor[color ?? ButtonColor.blue]}`,
    `button-${typeof props.size === 'string' ? props.size : ButtonSize[props.size ?? ButtonSize.auto]}`,
    `${square === true ? 'button-square' : ''}`
  ]

  return (
    <button
      {...otherProps}
      className={className.join(' ')}
      onClick={handleClick}
    >
      <span>
        {props.children}
      </span>
    </button>
  )
}

export default Button
