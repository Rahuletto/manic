import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { ManicWordmark } from '@/components/layout/ManicWordmark';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <ManicWordmark className="h-6 w-auto" />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
