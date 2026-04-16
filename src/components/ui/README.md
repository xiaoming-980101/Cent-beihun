# shadcn/ui Components - Customized for Figma Design

This directory contains shadcn/ui components customized according to the Figma design specifications for the Wedding Planning App UI redesign.

## Installed Components

### Button Component
**File:** `button.tsx`

**Customizations:**
- Uses design system colors (primary, secondary)
- Rounded corners: `rounded-lg` (8px)
- Font weight: `font-semibold` (600)
- Proper hover states with `primary-hover` color
- Full light/dark theme support

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

// Primary button
<Button>Click me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Ghost button
<Button variant="ghost">Ghost</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Icon />
</Button>
```

### Card Component
**File:** `card.tsx`

**Customizations:**
- Border radius: `rounded-xl` (12px) - matches Figma design
- Padding: `p-5` (20px) - matches `--card-padding`
- Shadow: `shadow-card` - uses custom card shadow from design tokens
- Border opacity: `border-opacity-50` for subtle borders
- Smooth shadow transition on hover
- Full light/dark theme support

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Badge Component
**File:** `badge.tsx`

**Customizations:**
- Border radius: `rounded-full` (9999px) - fully rounded as per Figma
- Font size: `text-tiny` (10px) - matches design specification
- Font weight: `font-bold` (700)
- Text transform: `uppercase`
- Full light/dark theme support

**Usage:**
```tsx
import { Badge } from '@/components/ui/badge';

// Default badge
<Badge>Essential</Badge>

// Secondary badge
<Badge variant="secondary">New</Badge>

// Outline badge
<Badge variant="outline">Draft</Badge>
```

## Theme Support

All components automatically support light and dark themes through CSS variables defined in:
- `src/styles/tokens/colors.css`
- `src/styles/tokens/typography.css`
- `src/styles/tokens/spacing.css`

The theme is managed by the `ThemeProvider` from `next-themes` (configured in task 1.3).

## Design System Integration

These components are integrated with the design system through:

1. **CSS Variables**: All colors, spacing, and typography use CSS variables
2. **Tailwind Configuration**: `tailwind.config.mjs` maps CSS variables to Tailwind utilities
3. **Theme Provider**: `lib/theme/theme-provider.tsx` manages theme switching

## Requirements Satisfied

- ✅ Requirement 16.1: Uses shadcn/ui component library as base
- ✅ Requirement 16.2: Components customized according to Figma design
- ✅ Requirement 16.3: API consistency maintained with shadcn/ui
- ✅ Requirement 16.4: Tailwind CSS used for styling
- ✅ Requirement 16.5: Component styles saved in components.json

## Next Steps

The following components will be created in subsequent tasks:
- IconBackground (Task 2.2)
- FeatureCard (Task 2.3)
- EmptyState (Task 2.4)
- ThemeToggle (Task 2.5)
