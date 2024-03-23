import React, { useId, useState } from 'react'
import { type Props as TabProps } from './Tab'
import { SoundManager } from 'global/SoundManager'
import './styles/tabstrip.scss'

export type Props<T extends string> = {
  className?: string
  children: Array<React.ReactElement<TabProps<T>>> | React.ReactElement<TabProps<T>>
  activeTab?: string
  onClick?: React.MouseEventHandler<Element>
  disabled?: boolean
  onTabSelected?: (tabId: T) => void
}

const Tabstrip = <T extends string> (props: Props<T>) => {
  const { activeTab = null, onClick, disabled = false } = props
  // used in autocollapse
  const [open, setOpen] = useState(false)
  const id = useId()
  const className = `${props.className ?? ''}${(disabled ? ' disabled' : '')}`

  const handleTabClick = (tabId: T) => {
    if ((props.onTabSelected != null) && props.disabled !== true) {
      props.onTabSelected(tabId)
    }
  }

  const children = React.Children.map(props.children, (child: React.ReactElement<TabProps<T>>) => {
    const clone: React.ReactElement<TabProps<T>> = React.cloneElement(child, {
      active: child.props.id === activeTab,
      onClick: () => { handleTabClick(child.props.id) }
    })
    return clone
  })

  const handleClick = (e: React.MouseEvent<Element>) => {
    void SoundManager.playSound('UI_BUTTON_CLICK')
    onClick?.(e)
    setOpen(!open)
  }

  return (
    <>
      <ul className={`tabstrip ${className ?? ''}`} onClick={handleClick}>
        <input type="checkbox" className="open" id={id} checked={open} onChange={() => { setOpen(!open) }} />
        {children}
      </ul>
    </>
  )
}

export default Tabstrip
