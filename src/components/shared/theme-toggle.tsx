import { Moon, Sun } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/theme/use-theme';
import { cn } from '@/utils';

export interface ThemeToggleProps extends Omit<ComponentProps<typeof Button>, 'children' | 'onClick'> {
  ariaLabel?: string;
}

export function ThemeToggle({ className, ariaLabel = '切换主题', ...props }: ThemeToggleProps) {
  const { theme, systemTheme, toggle } = useTheme();
  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const nextThemeLabel = resolvedTheme === 'dark' ? '切换到浅色模式' : '切换到深色模式';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      className={cn('relative rounded-lg', className)}
      aria-label={ariaLabel}
      title={nextThemeLabel}
      {...props}
    >
      <Sun
        className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        aria-hidden="true"
      />
      <Moon
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        aria-hidden="true"
      />
    </Button>
  );
}
