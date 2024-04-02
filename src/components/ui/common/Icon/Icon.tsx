import { type ComponentProps, type CSSProperties, type PropsWithChildren } from 'react'
import { sizeClassName, borderClassName, type IconSizeType, Border, IconSize } from './utils'

import './styles/icon.scss'
import { defineAssetPath } from 'utils/assets'

export type Props = {
  image: string
  size?: IconSizeType
  className?: string
  border?: Border | keyof typeof Border
}

const Icon = (props: PropsWithChildren<Props> & ComponentProps<'div'>) => {
  const {
    image,
    size,
    children,
    className = '',
    border = 'none',
    ...restProps
  } = props
  const style = { '--img': `url("${defineAssetPath(image)}")` }

  return (
    <div
      className={`icon ${sizeClassName((typeof size === 'string') ? IconSize[size] : size)} ${className}`}
      {...restProps}
      style={style as CSSProperties}
    >
      {children}
      { border !== 'none' && border !== undefined && (
        <div className={`border ${borderClassName((typeof border === 'string') ? Border[border] : border)} `}/>
      )}
    </div>
  )
}

export default Icon
