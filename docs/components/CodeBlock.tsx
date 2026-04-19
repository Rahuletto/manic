'use client';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import dynamic from 'next/dynamic';
import React from 'react';

const Mermaid = dynamic(() => import('./Mermaid'), { ssr: false });

export function CodeBlock({ children, ...props }: any) {
  // Check if this is a mermaid code block
  const child = React.Children.toArray(children)[0];
  
  if (
    child &&
    typeof child === 'object' &&
    'props' in child &&
    child.props.className === 'language-mermaid'
  ) {
    return <Mermaid chart={child.props.children} />;
  }

  return <defaultMdxComponents.pre {...props}>{children}</defaultMdxComponents.pre>;
}
