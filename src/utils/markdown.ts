/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from 'unist-util-visit';

export const reactMarkdownRemarkDirective = () => {
  return (tree: any) => {
    visit(
      tree,
      ['textDirective', 'leafDirective', 'containerDirective'],
      (node: any) => {
        node.data = {
          hName: node.name,
          hProperties: node.attributes,
          ...node.data,
        };
        return node;
      },
    );
  };
};
