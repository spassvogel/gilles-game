import ReactMarkdown from 'react-markdown'
import directive from 'remark-directive'
import { reactMarkdownRemarkDirective } from '../../utils/markdown'
import ItemElement from './ItemElement'
import CritDmgElement from './CritDmgElement'

import './styles/markdown.scss'

type Props = {
  children: string
}

const Markdown = (props: Props) => {
  const { children } = props
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[directive, reactMarkdownRemarkDirective]}
      components={{
        // @ts-expect-error TS2353 sorry dont know how to fix this
        item: ItemElement,
        crit: CritDmgElement
      }}
    >{children}</ReactMarkdown>
  )
}

export default Markdown
