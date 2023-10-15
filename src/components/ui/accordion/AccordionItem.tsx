import { type ComponentProps, type CSSProperties, type ReactElement, useContext, useLayoutEffect, useRef, useState } from 'react'
import { type Merge } from 'type-fest'
import { AccordionContext } from './context/AccordionContext'

export type Props = Merge<ComponentProps<'div'>, {
  id: string
  onHeaderClick?: () => void
  title: string | ReactElement
}>

const AccordionItem = (props: Props) => {
  const { title = '', className, id, children, onHeaderClick, ...rest } = props
  const context = useContext(AccordionContext)
  const contentRef = useRef<HTMLDivElement>(null)
  const [clientHeight, setClientHeight] = useState(0)
  const isExpanded = context?.itemsExpanded.indexOf(id) !== -1

  const classNames = [
    'accordion-item',
    className ?? '',
    ...(isExpanded ? ['expanded'] : [])
  ]

  const handleHeaderClick = () => {
    context?.toggleItem(id)
    onHeaderClick?.()
  }

  useLayoutEffect(() => {
    if (!isExpanded && (contentRef.current != null)) {
      setClientHeight(contentRef.current?.clientHeight)
    }
  }, [isExpanded])

  // when clientHeight is 0, it means it's collapsed. Set max-height to 1200
  const style = { '--content-height': clientHeight || 1200 } as CSSProperties
  return (
    <div className={classNames.join(' ')} style={style}>
      <header className='header' { ...rest } onClick={handleHeaderClick}>
        {title}
      </header>
      <div className="content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}

export default AccordionItem
