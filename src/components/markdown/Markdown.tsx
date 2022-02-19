import ReactMarkdown from 'react-markdown';
import directive from 'remark-directive';
import { reactMarkdownRemarkDirective } from '../../utils/markdown';
import ItemElement from './ItemElement';
import './styles/markdown.scss';

type Props = {
  children: string
};

const Markdown = (props: Props) => {
  const { children } = props;
  return (
    <ReactMarkdown
      className="markdown"
      remarkPlugins={[directive, reactMarkdownRemarkDirective]}
      components={{ item: ItemElement }}
    >{children}</ReactMarkdown>
  );
};

export default Markdown;
