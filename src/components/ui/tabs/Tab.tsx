import * as React from 'react'

export type Props<T extends string> = {
  id: T
  className?: string
  onClick?: React.MouseEventHandler<Element>
  active?: boolean
}

const Tab = <T extends string> (props: React.PropsWithChildren<Props<T>>) => {
  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (props.onClick != null) {
      props.onClick(e)
    }
  }
  const className = ((props.active) ? 'active' : '') + (props.className ?? '')
  return (
    <li className={`tabstrip-tab ${className}`} onClick={handleClick}>
      {props.children}
    </li>
  )
}

export default Tab
