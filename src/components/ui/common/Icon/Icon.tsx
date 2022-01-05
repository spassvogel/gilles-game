import { ComponentProps, PropsWithChildren } from 'react';
import { sizeClassName, borderClassName, IconSizeType, Border, IconSize } from './utils';
import './styles/icon.scss';

export interface Props {
  image: string;
  size?: IconSizeType;
  className?: string;
  border?: Border | keyof typeof Border;
}

const Icon = (props: PropsWithChildren<Props> & ComponentProps<'div'>) => {
  const {
    image,
    size,
    children,
    className = '',
    border = 'none',
    ...restProps
  } = props;
  return (
    <div
      className={`icon ${sizeClassName((typeof size === 'string') ? IconSize[size] : size)} ${className}`}
      {...restProps}
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}${image})`,
      }}
    >
      {children}
      { border !== 'none' && border && (
        <div className={`border ${borderClassName((typeof border === 'string') ? Border[border] : border)} `}/>
      )}
    </div>
  );
};

export default Icon;
