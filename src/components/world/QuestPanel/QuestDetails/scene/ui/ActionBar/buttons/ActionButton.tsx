import { type PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  onClick: () => void
  active?: boolean
}>

const ActionButton = (props: Props) => {
  const {
    active = false,
    onClick,
    children
  } = props
  return (
    <div
      className={`action-button ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default ActionButton
