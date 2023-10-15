import { type ComponentProps } from 'react'

import './styles/diamondFrame.scss'

type Props = ComponentProps<'div'>

const DiamondFrame = (props: Props) => {
  const { children, className = '', ...restProps } = props
  return (
    <div {...restProps} className={`diamond-frame ${className}`}>
      { children }
    </div>
  )
}

export default DiamondFrame
