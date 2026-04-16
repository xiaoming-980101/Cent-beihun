# UI Redesign Components

## Shared

- `IconBackground`: 4 color variants (`purple/blue/green/orange`) and 3 sizes (`sm/md/lg`).
- `FeatureCard`: toolbox card with icon slot, badge, description and action button.
- `EmptyState`: reusable empty state with optional action button.
- `ThemeToggle`: light/dark mode switch with Sun/Moon icon animation.
- `FloatingActionButton`: spring hover/tap animation for page primary actions.
- `LoadingSpinner`: unified loading indicator for lazy pages and async regions.
- `OptimizedImage`: image wrapper with lazy loading and async decoding.
- `ErrorBoundary`: page-level runtime fallback.
- `OfflineBanner`: network offline status prompt.

## Layout

- `TopAppBar`: title / actions / optional tabs.
- `BottomNavBar`: 7 primary routes with keyboard and ARIA support.
- `MainLayout`: app shell spacing and top+bottom bars.
- `PageTransition`: 200ms fade+rise route transition.

## Features

- `features/gift-book/gift-form-dialog.tsx`
- `features/guests/guest-form-dialog.tsx`
- `features/budget/budget-form-dialog.tsx`
- `features/tasks/task-list-view.tsx`
- `features/tasks/task-calendar-view.tsx`
- `features/statistics/chart-wrapper.tsx`

