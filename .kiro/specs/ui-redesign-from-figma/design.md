# Design Document: UI Redesign from Figma

## Overview

本设计文档定义了婚礼策划应用基于 Figma 原型的 UI 重构技术方案。该项目将全面改造应用的用户界面，采用现代化的 Bento Grid 卡片布局风格，实现浅色/深色双主题支持,并优化导航结构以提升用户体验。

### 设计目标

1. **视觉现代化**: 采用 Bento Grid 风格的卡片布局，提升视觉吸引力
2. **主题支持**: 实现完整的浅色/深色主题切换功能
3. **一致性**: 建立统一的设计系统，确保所有组件遵循相同的视觉规范
4. **性能优化**: 确保 UI 渲染性能达到 60fps，首次内容绘制在 1 秒内完成
5. **无障碍访问**: 符合 WCAG AA 标准，支持键盘导航和屏幕阅读器

### 技术栈

- **框架**: React 19.1.1 + TypeScript 5.8.3
- **路由**: React Router 7.8.2
- **状态管理**: Zustand 5.0.8
- **样式方案**: Tailwind CSS 4.1.12 + CSS Variables
- **组件库**: shadcn/ui (基于 Radix UI)
- **主题管理**: next-themes 0.4.6
- **图标库**: Lucide React 0.544.0
- **动画库**: Motion 12.23.24
- **数据可视化**: ECharts 6.0.0
- **表单管理**: React Hook Form 7.63.0 + Zod 4.1.11

## Architecture

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │   Layouts    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Design System Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Theme System │  │ Token System │  │ Component    │      │
│  │              │  │              │  │ Primitives   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      Foundation Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ CSS Variables│  │ Tailwind     │  │ Radix UI     │      │
│  │              │  │ Config       │  │ Primitives   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
src/
├── components/
│   ├── ui/                    # shadcn/ui 基础组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── layout/                # 布局组件
│   │   ├── top-app-bar.tsx
│   │   ├── bottom-nav-bar.tsx
│   │   ├── tab-bar.tsx
│   │   └── main-layout.tsx
│   ├── features/              # 功能组件
│   │   ├── gift-book/
│   │   ├── guest-management/
│   │   ├── task-management/
│   │   └── ...
│   └── shared/                # 共享组件
│       ├── icon-background.tsx
│       ├── feature-card.tsx
│       └── empty-state.tsx
├── styles/
│   ├── globals.css            # 全局样式和 CSS 变量
│   ├── themes/                # 主题定义
│   │   ├── light.css
│   │   └── dark.css
│   └── tokens/                # 设计令牌
│       ├── colors.css
│       ├── typography.css
│       └── spacing.css
├── lib/
│   ├── theme/                 # 主题管理
│   │   ├── theme-provider.tsx
│   │   └── use-theme.ts
│   └── utils/
│       └── cn.ts              # className 合并工具
└── pages/
    ├── home.tsx
    ├── tools.tsx
    ├── gift-book.tsx
    ├── statistics.tsx
    ├── guests.tsx
    ├── tasks.tsx
    └── search.tsx
```

## Components and Interfaces

### 1. Design System Components

#### 1.1 Theme Provider

```typescript
// lib/theme/theme-provider.tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'wedding-app-theme',
}: ThemeProviderProps) {
  // 使用 next-themes 实现主题切换
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
```

#### 1.2 Icon Background Component

```typescript
// components/shared/icon-background.tsx
interface IconBackgroundProps {
  icon: React.ReactNode;
  variant: 'purple' | 'blue' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
}

export function IconBackground({
  icon,
  variant,
  size = 'md',
}: IconBackgroundProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const variantClasses = {
    purple: 'bg-purple-100 dark:bg-purple-950',
    blue: 'bg-blue-100 dark:bg-blue-950',
    green: 'bg-green-100 dark:bg-green-950',
    orange: 'bg-orange-100 dark:bg-orange-950',
  };

  return (
    <div
      className={cn(
        'rounded-2xl flex items-center justify-center',
        sizeClasses[size],
        variantClasses[variant]
      )}
    >
      {icon}
    </div>
  );
}
```

#### 1.3 Feature Card Component

```typescript
// components/shared/feature-card.tsx
interface FeatureCardProps {
  icon: React.ReactNode;
  iconVariant: 'purple' | 'blue' | 'green' | 'orange';
  title: string;
  description: string;
  badge?: string;
  onAction: () => void;
  actionText?: string;
}

export function FeatureCard({
  icon,
  iconVariant,
  title,
  description,
  badge,
  onAction,
  actionText = '进入工具',
}: FeatureCardProps) {
  return (
    <Card className="p-5 border-opacity-50 hover:shadow-lg transition-shadow">
      {/* Icon and Badge Row */}
      <div className="flex items-start justify-between mb-4">
        <IconBackground icon={icon} variant={iconVariant} />
        {badge && (
          <Badge variant="secondary" className="rounded-full text-xs font-bold uppercase">
            {badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1 mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      <button
        onClick={onAction}
        className="flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
      >
        <span>{actionText}</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </Card>
  );
}
```

### 2. Layout Components

#### 2.1 Top App Bar

```typescript
// components/layout/top-app-bar.tsx
interface TopAppBarProps {
  title: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  tabs?: Array<{ label: string; value: string }>;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

export function TopAppBar({
  title,
  showBack = false,
  actions,
  tabs,
  activeTab,
  onTabChange,
}: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-pink-100 dark:border-gray-800">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Tab Bar (if provided) */}
      {tabs && tabs.length > 0 && (
        <div className="px-4 flex gap-6 border-t border-gray-100 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange?.(tab.value)}
              className={cn(
                'py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.value
                  ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
```

#### 2.2 Bottom Navigation Bar

```typescript
// components/layout/bottom-nav-bar.tsx
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface BottomNavBarProps {
  items: NavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export function BottomNavBar({ items, activeId, onNavigate }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="h-20 px-2 flex items-center justify-around">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div
                className={cn(
                  'transition-colors',
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              >
                {item.icon}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isActive
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400'
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
```

#### 2.3 Main Layout

```typescript
// components/layout/main-layout.tsx
interface MainLayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
  topBarProps?: Partial<TopAppBarProps>;
}

export function MainLayout({
  children,
  showTopBar = true,
  showBottomNav = true,
  topBarProps,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {showTopBar && <TopAppBar {...topBarProps} />}
      
      <main
        className={cn(
          'pb-safe',
          showTopBar && 'pt-16',
          showBottomNav && 'pb-20'
        )}
      >
        <div className="px-4 py-6">
          {children}
        </div>
      </main>

      {showBottomNav && <BottomNavBar {...navBarProps} />}
    </div>
  );
}
```

### 3. Page Components

#### 3.1 Tools Page (工具箱)

```typescript
// pages/tools.tsx
export function ToolsPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: 'gift-book',
      icon: <Gift className="w-6 h-6 text-purple-600" />,
      iconVariant: 'purple' as const,
      title: '礼金簿',
      description: '精准记录每一份礼金，收礼送礼一目了然，人情往来不漏记。',
      badge: 'Essential',
      path: '/gift-book',
    },
    {
      id: 'guests',
      icon: <Users className="w-7.5 h-3.75 text-blue-600" />,
      iconVariant: 'blue' as const,
      title: '亲友管理',
      description: '管理宾客名单、邀请状态及桌位安排，让现场井然有序。',
      path: '/guests',
    },
    // ... more features
  ];

  return (
    <MainLayout
      topBarProps={{
        title: '工具箱',
        actions: <ThemeToggle />,
      }}
    >
      {/* Hero Section */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          婚礼工具箱
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          高效备婚，从这里开始
        </p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            {...feature}
            onAction={() => navigate(feature.path)}
          />
        ))}
      </div>
    </MainLayout>
  );
}
```

## Data Models

### Theme Configuration

```typescript
// types/theme.ts
export interface ThemeColors {
  // Background colors
  background: string;
  cardBackground: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  
  // Brand colors
  primary: string;
  primaryLight: string;
  primaryLighter: string;
  
  // Border colors
  border: string;
  borderLight: string;
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}
```

### Design Tokens

```typescript
// types/tokens.ts
export interface DesignTokens {
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
    };
    fontSize: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      caption: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    cardPadding: string;
    cardGap: string;
    sectionGap: string;
  };
  borderRadius: {
    card: string;
    iconBackground: string;
    badge: string;
  };
  shadows: {
    card: string;
  };
}
```

## Error Handling

### Error Boundary Component

```typescript
// components/shared/error-boundary.tsx
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error?: Error }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                出错了
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                页面加载失败，请刷新重试
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                刷新页面
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### Empty State Component

```typescript
// components/shared/empty-state.tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
```

## Testing Strategy

由于本项目是 UI 重构项目，主要涉及视觉组件、布局、样式和用户界面实现，**不适用属性测试（Property-Based Testing）**。根据 PBT 适用性指南，UI 渲染和布局应使用快照测试和视觉回归测试。

### 测试方法

#### 1. 单元测试（Unit Tests）

使用 Vitest 进行组件单元测试，重点测试：

- **组件渲染**: 验证组件能正确渲染
- **Props 处理**: 验证组件正确处理不同的 props
- **事件处理**: 验证用户交互触发正确的回调
- **条件渲染**: 验证组件根据状态正确显示/隐藏内容

```typescript
// __tests__/components/feature-card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard } from '@/components/shared/feature-card';

describe('FeatureCard', () => {
  it('renders with required props', () => {
    const mockAction = vi.fn();
    render(
      <FeatureCard
        icon={<div>Icon</div>}
        iconVariant="purple"
        title="Test Feature"
        description="Test description"
        onAction={mockAction}
      />
    );

    expect(screen.getByText('Test Feature')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', () => {
    const mockAction = vi.fn();
    render(
      <FeatureCard
        icon={<div>Icon</div>}
        iconVariant="purple"
        title="Test Feature"
        description="Test description"
        onAction={mockAction}
      />
    );

    fireEvent.click(screen.getByText('进入工具'));
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders badge when provided', () => {
    render(
      <FeatureCard
        icon={<div>Icon</div>}
        iconVariant="purple"
        title="Test Feature"
        description="Test description"
        badge="Essential"
        onAction={() => {}}
      />
    );

    expect(screen.getByText('Essential')).toBeInTheDocument();
  });
});
```

#### 2. 集成测试（Integration Tests）

测试组件之间的交互和页面级功能：

```typescript
// __tests__/pages/tools.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ToolsPage } from '@/pages/tools';

describe('ToolsPage', () => {
  it('renders all feature cards', () => {
    render(
      <BrowserRouter>
        <ToolsPage />
      </BrowserRouter>
    );

    expect(screen.getByText('礼金簿')).toBeInTheDocument();
    expect(screen.getByText('亲友管理')).toBeInTheDocument();
  });

  it('navigates to feature page when card is clicked', () => {
    const { container } = render(
      <BrowserRouter>
        <ToolsPage />
      </BrowserRouter>
    );

    const giftBookCard = screen.getByText('礼金簿').closest('div');
    const actionButton = giftBookCard?.querySelector('button');
    
    fireEvent.click(actionButton!);
    // Verify navigation occurred
  });
});
```

#### 3. 视觉回归测试（Visual Regression Tests）

使用 Playwright 进行视觉回归测试，确保 UI 变更不会意外影响视觉效果：

```typescript
// __tests__/visual/tools-page.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Tools Page Visual Tests', () => {
  test('light mode snapshot', async ({ page }) => {
    await page.goto('/tools');
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    await expect(page).toHaveScreenshot('tools-page-light.png');
  });

  test('dark mode snapshot', async ({ page }) => {
    await page.goto('/tools');
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await expect(page).toHaveScreenshot('tools-page-dark.png');
  });

  test('responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/tools');
    await expect(page).toHaveScreenshot('tools-page-mobile.png');
  });
});
```

#### 4. 主题切换测试

```typescript
// __tests__/theme/theme-switching.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { ThemeToggle } from '@/components/shared/theme-toggle';

describe('Theme Switching', () => {
  it('toggles between light and dark mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    
    // Initial state (light mode)
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Toggle to dark mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back to light mode
    fireEvent.click(toggleButton);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('persists theme preference to localStorage', () => {
    render(
      <ThemeProvider storageKey="test-theme">
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggleButton = screen.getByRole('button');
    fireEvent.click(toggleButton);

    expect(localStorage.getItem('test-theme')).toBe('dark');
  });
});
```

#### 5. 无障碍测试（Accessibility Tests）

```typescript
// __tests__/a11y/accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FeatureCard } from '@/components/shared/feature-card';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('FeatureCard has no accessibility violations', async () => {
    const { container } = render(
      <FeatureCard
        icon={<div>Icon</div>}
        iconVariant="purple"
        title="Test Feature"
        description="Test description"
        onAction={() => {}}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    const mockAction = vi.fn();
    render(
      <FeatureCard
        icon={<div>Icon</div>}
        iconVariant="purple"
        title="Test Feature"
        description="Test description"
        onAction={mockAction}
      />
    );

    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(mockAction).toHaveBeenCalled();
  });
});
```

### 测试覆盖率目标

- **组件单元测试**: 80% 代码覆盖率
- **集成测试**: 覆盖所有主要用户流程
- **视觉回归测试**: 覆盖所有页面的浅色/深色模式
- **无障碍测试**: 所有交互组件通过 axe 检查

### 测试执行策略

1. **开发阶段**: 使用 `vitest --watch` 进行实时测试
2. **提交前**: 运行完整测试套件 `pnpm test`
3. **CI/CD**: 自动运行所有测试，包括视觉回归测试
4. **发布前**: 手动进行跨浏览器和跨设备测试



## Design System Implementation

### CSS Variables Structure

```css
/* styles/tokens/colors.css */
:root {
  /* Light Mode Colors */
  --color-background: #f9f9f9;
  --color-card-bg: #ffffff;
  
  /* Text Colors */
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #544249;
  
  /* Brand Colors - Purple */
  --color-primary: #9333ea;
  --color-primary-hover: #a855f7;
  --color-primary-light: #f3e8ff;
  --color-primary-lighter: #faf5ff;
  
  /* Brand Colors - Blue */
  --color-secondary: #2563eb;
  --color-secondary-light: #dbeafe;
  
  /* Border Colors */
  --color-border: #fdf2f8;
  --color-border-light: #f3f4f6;
  
  /* Shadow */
  --shadow-card: 0 4px 20px -2px rgba(244, 114, 182, 0.1);
}

.dark {
  /* Dark Mode Colors */
  --color-background: #0c0e0e;
  --color-card-bg: #121414;
  
  /* Text Colors */
  --color-text-primary: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-text-tertiary: #d1d5db;
  
  /* Brand Colors - Purple */
  --color-primary: #a855f7;
  --color-primary-hover: #9333ea;
  --color-primary-light: #581c87;
  --color-primary-lighter: #3b0764;
  
  /* Brand Colors - Blue */
  --color-secondary: #3b82f6;
  --color-secondary-light: #1e3a8a;
  
  /* Border Colors */
  --color-border: #ffffff;
  --color-border-light: #27272a;
  
  /* Shadow */
  --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
}
```

```css
/* styles/tokens/typography.css */
:root {
  /* Font Families */
  --font-primary: 'WenQuanYi Zen Hei', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* Font Sizes */
  --text-h1: 28px;
  --text-h2: 24px;
  --text-h3: 18px;
  --text-body: 14px;
  --text-caption: 12px;
  --text-tiny: 10px;
  
  /* Font Weights */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
}
```

```css
/* styles/tokens/spacing.css */
:root {
  /* Spacing Scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  
  /* Component Specific */
  --card-padding: 20px;
  --card-gap: 16px;
  --section-gap: 24px;
  --nav-height: 64px;
  --bottom-nav-height: 80px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
}
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        card: {
          DEFAULT: 'var(--color-card-bg)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
          lighter: 'var(--color-primary-lighter)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          light: 'var(--color-border-light)',
        },
      },
      fontFamily: {
        sans: ['var(--font-primary)'],
        inter: ['var(--font-secondary)'],
      },
      fontSize: {
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        body: 'var(--text-body)',
        caption: 'var(--text-caption)',
        tiny: 'var(--text-tiny)',
      },
      spacing: {
        'nav': 'var(--nav-height)',
        'bottom-nav': 'var(--bottom-nav-height)',
      },
      borderRadius: {
        'card': 'var(--radius-md)',
        'icon': 'var(--radius-lg)',
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
      },
      transitionDuration: {
        'theme': '200ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

### Theme Toggle Component

```typescript
// components/shared/theme-toggle.tsx
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme/use-theme';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-lg"
      aria-label="切换主题"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

## Navigation Implementation

### Navigation Configuration

```typescript
// config/navigation.ts
import {
  Home,
  Wrench,
  Gift,
  BarChart3,
  Users,
  CheckSquare,
  Search,
} from 'lucide-react';

export const navigationItems = [
  {
    id: 'home',
    label: '主页',
    icon: Home,
    path: '/',
  },
  {
    id: 'tools',
    label: '工具箱',
    icon: Wrench,
    path: '/tools',
  },
  {
    id: 'gift-book',
    label: '礼金簿',
    icon: Gift,
    path: '/gift-book',
  },
  {
    id: 'statistics',
    label: '统计',
    icon: BarChart3,
    path: '/statistics',
  },
  {
    id: 'guests',
    label: '亲友',
    icon: Users,
    path: '/guests',
  },
  {
    id: 'tasks',
    label: '任务',
    icon: CheckSquare,
    path: '/tasks',
  },
  {
    id: 'search',
    label: '搜索',
    icon: Search,
    path: '/search',
  },
] as const;
```

### Router Configuration

```typescript
// router/index.tsx
import { createBrowserRouter } from 'react-router';
import { MainLayout } from '@/components/layout/main-layout';
import { HomePage } from '@/pages/home';
import { ToolsPage } from '@/pages/tools';
import { GiftBookPage } from '@/pages/gift-book';
import { StatisticsPage } from '@/pages/statistics';
import { GuestsPage } from '@/pages/guests';
import { TasksPage } from '@/pages/tasks';
import { SearchPage } from '@/pages/search';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'tools',
        element: <ToolsPage />,
      },
      {
        path: 'gift-book',
        element: <GiftBookPage />,
      },
      {
        path: 'statistics',
        element: <StatisticsPage />,
      },
      {
        path: 'guests',
        element: <GuestsPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
        children: [
          {
            path: 'list',
            element: <TaskListView />,
          },
          {
            path: 'calendar',
            element: <TaskCalendarView />,
          },
        ],
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
    ],
  },
]);
```

## Page Implementations

### Home Page

```typescript
// pages/home.tsx
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Calendar, DollarSign, Gift, CheckSquare } from 'lucide-react';

export function HomePage() {
  return (
    <MainLayout
      topBarProps={{
        title: '主页',
        actions: <ThemeToggle />,
      }}
    >
      {/* Countdown Card */}
      <Card className="p-6 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6" />
          <h3 className="text-lg font-bold">婚礼倒计时</h3>
        </div>
        <div className="text-center py-4">
          <div className="text-5xl font-bold mb-1">120</div>
          <div className="text-sm opacity-90">天</div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">礼金总额</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ¥50,000
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">预算剩余</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ¥30,000
          </div>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            今日待办
          </h3>
          <button className="text-sm text-purple-600 dark:text-purple-400">
            查看全部
          </button>
        </div>
        <div className="space-y-3">
          {/* Task items */}
          <div className="flex items-center gap-3">
            <CheckSquare className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              确认婚宴场地
            </span>
          </div>
          {/* More tasks... */}
        </div>
      </Card>
    </MainLayout>
  );
}
```

### Gift Book Page

```typescript
// pages/gift-book.tsx
import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';

export function GiftBookPage() {
  const [gifts, setGifts] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <MainLayout
      topBarProps={{
        title: '礼金簿',
        actions: (
          <Button variant="ghost" size="icon">
            <Filter className="w-5 h-5" />
          </Button>
        ),
      }}
    >
      {gifts.length === 0 ? (
        <EmptyState
          icon={<Gift className="w-16 h-16" />}
          title="还没有礼金记录"
          description="点击下方按钮添加第一条礼金记录"
          action={{
            label: '添加礼金',
            onClick: () => setShowAddDialog(true),
          }}
        />
      ) : (
        <div className="space-y-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className="p-4">
              {/* Gift item content */}
            </Card>
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddDialog(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        aria-label="添加礼金"
      >
        <Plus className="w-6 h-6" />
      </button>
    </MainLayout>
  );
}
```

### Tasks Page with Tabs

```typescript
// pages/tasks.tsx
import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { TaskListView } from '@/components/features/tasks/task-list-view';
import { TaskCalendarView } from '@/components/features/tasks/task-calendar-view';

export function TasksPage() {
  const [activeTab, setActiveTab] = useState('list');

  const tabs = [
    { label: '列表', value: 'list' },
    { label: '日历', value: 'calendar' },
  ];

  return (
    <MainLayout
      topBarProps={{
        title: '任务管理',
        tabs,
        activeTab,
        onTabChange: setActiveTab,
      }}
    >
      {activeTab === 'list' ? <TaskListView /> : <TaskCalendarView />}
    </MainLayout>
  );
}
```

## Performance Optimization

### 1. Code Splitting

```typescript
// router/index.tsx
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home'));
const ToolsPage = lazy(() => import('@/pages/tools'));
const GiftBookPage = lazy(() => import('@/pages/gift-book'));
// ... other pages

// Wrap with Suspense
function LazyPage({ Component }: { Component: React.LazyExoticComponent<any> }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  );
}
```

### 2. Virtual Scrolling for Long Lists

```typescript
// components/features/gift-book/gift-list.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export function GiftList({ items }: { items: Gift[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated item height
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <GiftItem gift={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 3. Image Optimization

```typescript
// components/shared/optimized-image.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function OptimizedImage({ src, alt, className }: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}
```

### 4. CSS Containment

```css
/* styles/globals.css */
.card-container {
  contain: layout style paint;
}

.list-item {
  contain: layout style;
}

.icon-background {
  contain: layout paint;
}
```

### 5. Debounced Search

```typescript
// hooks/use-debounced-search.ts
import { useState, useEffect } from 'react';
import { debounce } from 'lodash-es';

export function useDebouncedSearch(delay = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchTerm, delay]);

  return { searchTerm, setSearchTerm, debouncedTerm };
}
```

## Accessibility Implementation

### 1. Keyboard Navigation

```typescript
// components/layout/bottom-nav-bar.tsx
export function BottomNavBar({ items, activeId, onNavigate }: BottomNavBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent, itemId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNavigate(itemId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50" role="navigation" aria-label="主导航">
      <div className="h-20 px-2 flex items-center justify-around">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-lg"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              <div className={cn('transition-colors', isActive && 'text-purple-600')}>
                {item.icon}
              </div>
              <span className={cn('text-xs font-medium', isActive && 'text-purple-600')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

### 2. ARIA Labels and Roles

```typescript
// components/shared/feature-card.tsx
export function FeatureCard({ icon, title, description, onAction }: FeatureCardProps) {
  return (
    <article
      className="p-5 border rounded-card"
      role="article"
      aria-labelledby={`feature-${title}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div aria-hidden="true">
          <IconBackground icon={icon} variant="purple" />
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h3
          id={`feature-${title}`}
          className="text-lg font-bold"
        >
          {title}
        </h3>
        <p className="text-xs text-gray-600">
          {description}
        </p>
      </div>

      <button
        onClick={onAction}
        className="flex items-center gap-1 text-sm font-semibold"
        aria-label={`进入${title}`}
      >
        <span>进入工具</span>
        <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </article>
  );
}
```

### 3. Focus Management

```typescript
// hooks/use-focus-trap.ts
import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return containerRef;
}
```

### 4. Screen Reader Support

```typescript
// components/shared/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div
      className="flex items-center justify-center p-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      <span className="sr-only">加载中...</span>
    </div>
  );
}
```

## Animation and Transitions

### 1. Page Transitions

```typescript
// components/layout/page-transition.tsx
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 2. Card Hover Effects

```css
/* styles/components/card.css */
.feature-card {
  transition: all 0.2s ease-in-out;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.feature-card:active {
  transform: translateY(0);
}
```

### 3. Theme Transition

```css
/* styles/globals.css */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

### 4. FAB Animation

```typescript
// components/shared/floating-action-button.tsx
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

export function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-24 right-4 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="添加"
    >
      <Plus className="w-6 h-6 mx-auto" />
    </motion.button>
  );
}
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

1. **设计系统搭建**
   - 创建 CSS 变量和设计令牌
   - 配置 Tailwind CSS
   - 实现主题切换功能

2. **基础组件开发**
   - 实现 shadcn/ui 组件定制
   - 开发 IconBackground、Badge 等共享组件
   - 创建布局组件（TopAppBar、BottomNavBar）

### Phase 2: Core Pages (Week 3-4)

1. **主要页面重构**
   - 工具箱页面
   - 主页
   - 礼金簿页面

2. **导航系统**
   - 实现底部导航栏
   - 实现顶部应用栏
   - 实现标签栏切换

### Phase 3: Feature Pages (Week 5-6)

1. **功能页面重构**
   - 统计分析页面
   - 亲友管理页面
   - 任务管理页面（列表和日历视图）
   - 搜索筛选页面
   - 婚礼预算页面

### Phase 4: Polish & Testing (Week 7-8)

1. **优化和测试**
   - 性能优化
   - 无障碍测试
   - 视觉回归测试
   - 跨浏览器测试

2. **文档和部署**
   - 组件文档
   - 使用指南
   - 部署到生产环境

## Success Metrics

### Performance Metrics

- **首次内容绘制 (FCP)**: < 1 秒
- **最大内容绘制 (LCP)**: < 2.5 秒
- **首次输入延迟 (FID)**: < 100 毫秒
- **累积布局偏移 (CLS)**: < 0.1
- **滚动帧率**: 60 FPS

### Quality Metrics

- **代码覆盖率**: > 80%
- **无障碍评分**: WCAG AA 级别
- **Lighthouse 评分**: > 90 分
- **Bundle 大小**: < 500KB (gzipped)

### User Experience Metrics

- **主题切换响应时间**: < 200ms
- **页面切换动画流畅度**: 60 FPS
- **交互响应时间**: < 100ms
- **错误率**: < 1%

