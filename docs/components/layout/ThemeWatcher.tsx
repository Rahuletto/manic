'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function ThemeWatcher() {
  const pathname = usePathname();

  useEffect(() => {
    // Detect root from pathname: /docs/framework/..., /docs/api/...
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'docs' && segments[1]) {
      const root = segments[1];
      document.documentElement.setAttribute('data-root', root);
    } else {
      document.documentElement.removeAttribute('data-root');
    }
  }, [pathname]);

  return null;
}
