'use client';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import dynamic from 'next/dynamic';
import React from 'react';

const Mermaid = dynamic(() => import('./Mermaid'), { ssr: false });

export function CodeBlock(props: React.ComponentProps<'pre'>) {
  const { children, className, ...rest } = props;

  const childArray = React.Children.toArray(children);
  if (childArray.length > 0) {
    const child = childArray[0] as React.ReactElement<{ className?: string; children?: React.ReactNode }>;

    if (child?.props?.className === 'language-mermaid') {
      const chartText = String(child.props.children ?? '');
      return <Mermaid chart={chartText} />;
    }
  }

  return (
    <defaultMdxComponents.pre
      className={className}
      {...rest}
    >
      {children}
    </defaultMdxComponents.pre>
  );
}