# UI Migration Guide (Old -> New)

## Scope

This guide tracks migration from legacy wedding UI blocks to the redesigned component system.

## Core Mappings

- `WeddingEmptyState` -> `components/shared/EmptyState`
- Inline fab buttons -> `components/shared/FloatingActionButton`
- Inline gift/guest/budget dialogs -> `components/features/*/*-form-dialog`
- Legacy page routing in `route.tsx` -> `router/index.tsx` with `PageTransition`

## Breaking Changes

- Shared components now use standardized design tokens and semantic classes.
- Feature dialogs are separated by domain (`gift-book`, `guests`, `budget`).
- Search input uses debounced behavior (`use-debounced-search`) and may issue queries without pressing search.

## Compatibility Notes

- Existing store schemas (`weddingData`) are unchanged.
- Existing route paths are unchanged.
- Existing form payload field names are unchanged.

## Recommended Rollout

1. Keep current routes and swap page internals module-by-module.
2. Validate key user flows: add/edit/delete for gifts, guests, tasks, budgets.
3. Run unit/integration + Playwright visual snapshots before release.

