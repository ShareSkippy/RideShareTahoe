'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { useEffect } from 'react';

function ThemeDataAttributeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) {
      return;
    }

    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeDataAttributeSync />
      {children}
    </NextThemesProvider>
  );
}
