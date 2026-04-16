# Shared Components

This directory contains shared UI components used across the Wedding Planning App.

## IconBackground Component

A reusable component that wraps icons with colored backgrounds, used for feature cards and visual hierarchy.

### Features

- **4 Color Variants**: purple, blue, green, orange
- **3 Size Options**: sm (40x40px), md (48x48px), lg (64x64px)
- **Border Radius**: 16px (rounded-2xl)
- **Theme Support**: Automatic light/dark mode support
- **Accessibility**: Fully accessible with proper ARIA attributes

### Usage

```tsx
import { IconBackground } from '@/components/shared';
import { Gift } from 'lucide-react';

// Basic usage with default props (purple, md)
<IconBackground 
  icon={<Gift className="w-6 h-6 text-purple-600" />} 
/>

// With custom variant and size
<IconBackground 
  icon={<Users className="w-6 h-6 text-blue-600" />} 
  variant="blue"
  size="lg"
/>

// In a feature card
<div className="p-5 border rounded-xl">
  <IconBackground 
    icon={<Gift className="w-6 h-6 text-purple-600" />} 
    variant="purple"
  />
  <h3 className="text-lg font-bold mt-4">礼金簿</h3>
  <p className="text-xs text-gray-600 mt-1">精准记录每一份礼金</p>
</div>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `React.ReactNode` | required | The icon element to display |
| `variant` | `'purple' \| 'blue' \| 'green' \| 'orange'` | `'purple'` | Background color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the container |
| `className` | `string` | - | Additional CSS classes |

### Color Variants

- **Purple**: `bg-purple-100` (light) / `bg-purple-950` (dark)
- **Blue**: `bg-blue-100` (light) / `bg-blue-950` (dark)
- **Green**: `bg-green-100` (light) / `bg-green-950` (dark)
- **Orange**: `bg-orange-100` (light) / `bg-orange-950` (dark)

### Size Specifications

- **Small (sm)**: 40x40px (`w-10 h-10`)
- **Medium (md)**: 48x48px (`w-12 h-12`)
- **Large (lg)**: 64x64px (`w-16 h-16`)

### Icon Size Recommendations

Match your icon size to the container size for best results:

- **sm container**: Use `w-4 h-4` icons
- **md container**: Use `w-6 h-6` icons
- **lg container**: Use `w-8 h-8` icons

### Examples

See `icon-background.example.tsx` for comprehensive usage examples including:
- All color variants
- All size variants
- Integration with feature cards
- Dark mode support

### Testing

The component has comprehensive test coverage:
- Unit tests: `__tests__/icon-background.test.tsx` (12 tests)
- Integration tests: `__tests__/icon-background-integration.test.tsx` (5 tests)

Run tests with:
```bash
pnpm test src/components/shared
```

### Requirements

This component satisfies the following requirements:
- **Requirement 4.5**: Icon background containers for feature cards
- **Requirement 17.3**: Icon system with consistent sizing

### Design System

The component follows the Figma design specifications:
- Uses CSS variables for theme support
- Implements proper spacing and sizing
- Supports light and dark modes
- Uses Tailwind CSS for styling
- Follows the Bento Grid design system

## Additional Shared Components

### FeatureCard
- Composes `IconBackground + Badge + action button`
- Used in toolbox Bento grid cards
- Supports optional badge and custom action text

### EmptyState
- Provides consistent empty state skeleton for list pages
- Supports custom icon, title/description, and optional primary action

### ThemeToggle
- Uses Sun/Moon icons with smooth rotation/scale transition
- Integrates with `useTheme` hook from `next-themes`

## Future Components

Planned next shared components:
- FloatingActionButton
- LoadingSpinner
