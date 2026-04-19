import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const allTabs = getSidebarTabs(source.getPageTree());

  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      tabs={allTabs}
    >
      {children}
    </DocsLayout>
  );
}
