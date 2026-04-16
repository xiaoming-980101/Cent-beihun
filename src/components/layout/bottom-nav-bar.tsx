import {
  BarChart3,
  CheckSquare,
  Gift,
  Home,
  Search,
  Wrench,
  Users,
} from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';

import { cn } from '@/utils';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export interface BottomNavBarProps {
  items?: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  className?: string;
}

export const defaultBottomNavItems: NavItem[] = [
  { id: 'home', label: '主页', icon: <Home className="h-5 w-5" />, path: '/' },
  { id: 'tools', label: '工具箱', icon: <Wrench className="h-5 w-5" />, path: '/tools' },
  { id: 'gift-book', label: '礼金簿', icon: <Gift className="h-5 w-5" />, path: '/tools/gift-book' },
  { id: 'statistics', label: '统计', icon: <BarChart3 className="h-5 w-5" />, path: '/stat' },
  { id: 'guests', label: '亲友', icon: <Users className="h-5 w-5" />, path: '/tools/guests' },
  { id: 'tasks', label: '任务', icon: <CheckSquare className="h-5 w-5" />, path: '/tasks' },
  { id: 'search', label: '搜索', icon: <Search className="h-5 w-5" />, path: '/search' },
];

export function BottomNavBar({
  items = defaultBottomNavItems,
  activeId,
  onNavigate,
  className,
}: BottomNavBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, itemId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigate(itemId);
    }
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card',
        className,
      )}
      role="navigation"
      aria-label="主导航"
    >
      <div className="flex h-20 items-center justify-around px-2">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              onKeyDown={(event) => handleKeyDown(event, item.id)}
              className="flex min-w-[60px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              <span
                className={cn(
                  'transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary',
                )}
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-text-secondary',
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
