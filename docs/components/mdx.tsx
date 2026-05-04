import React from 'react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from './CodeBlock';
import { Callout } from 'fumadocs-ui/components/callout';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { File, Folder, Files } from 'fumadocs-ui/components/files';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui';
import Mermaid from './Mermaid';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: CodeBlock,
    Callout,
    Steps,
    Step,
    TypeTable,
    Tabs,
    Tab,
    Files,
    Folder,
    File,
    Accordion,
    Accordions,
    Card,
    Cards,
    ImageZoom,
    Mermaid: Mermaid,
    Popup,
    PopupContent,
    PopupTrigger,
    Tooltip: Popup,
    TooltipContent: PopupContent,
    TooltipTrigger: PopupTrigger,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}