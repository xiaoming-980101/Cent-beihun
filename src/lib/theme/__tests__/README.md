# Theme Management System Unit Tests

This directory contains comprehensive unit tests for the theme management system implemented in task 1.3.

## Test Coverage

### 1. Theme Provider Tests (`theme-provider.test.tsx`)
Tests the core ThemeProvider component functionality:
- ✅ Renders children correctly
- ✅ Uses default theme when no preference is stored
- ✅ Applies custom storage key
- ✅ Uses default storage key when not provided

**Requirements Validated:** 2.1, 2.3, 2.4

### 2. Theme Switching Tests (`theme-switching.test.tsx`)
Tests theme switching functionality and performance:
- ✅ Switches from light to dark theme
- ✅ Switches from dark to light theme
- ✅ Toggles between light and dark themes
- ✅ Switches to system theme
- ✅ Completes theme switch within 200ms (Requirement 2.2)

**Requirements Validated:** 2.1, 2.2, 2.5

### 3. CSS Variables Tests (`css-variables.test.tsx`)
Tests CSS variable application in different themes:
- ✅ Applies light mode CSS variables correctly
- ✅ Applies dark mode CSS variables correctly
- ✅ Updates CSS variables when theme changes
- ✅ Maintains CSS variable definitions in light mode
- ✅ Maintains CSS variable definitions in dark mode
- ✅ Applies theme class to document element

**Requirements Validated:** 1.1, 1.2, 2.1, 2.2

**Note:** These tests verify that the correct theme classes are applied to the document element. The actual CSS variable values are defined in `src/styles/tokens/colors.css` and are applied via the `.dark` class selector.

### 4. localStorage Persistence Tests (`localstorage-persistence.test.tsx`)
Tests theme preference persistence:
- ✅ Saves theme preference to localStorage when changed
- ✅ Loads theme preference from localStorage on mount
- ✅ Persists light theme preference
- ✅ Persists dark theme preference
- ✅ Persists system theme preference
- ✅ Maintains theme preference across re-renders
- ✅ Uses custom storage key correctly
- ✅ Handles missing localStorage gracefully
- ✅ Updates localStorage immediately on theme change

**Requirements Validated:** 2.3, 2.4

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui
```

## Test Framework

- **Testing Framework:** Vitest 4.1.4
- **React Testing:** @testing-library/react 16.3.2
- **User Interactions:** @testing-library/user-event 14.6.1
- **DOM Assertions:** @testing-library/jest-dom 6.9.1
- **Environment:** jsdom 29.0.2

## Implementation Details

### Theme Provider
The theme system uses `next-themes` library which provides:
- Automatic theme detection from system preferences
- localStorage persistence
- SSR-safe theme loading
- Smooth theme transitions

### CSS Variables
Theme-specific CSS variables are defined in:
- `src/styles/tokens/colors.css` - Color tokens for light and dark modes
- `src/styles/tokens/typography.css` - Typography tokens
- `src/styles/tokens/spacing.css` - Spacing and layout tokens

### Storage Key
Default storage key: `wedding-app-theme`
Can be customized via the `storageKey` prop on ThemeProvider.

## Test Limitations

Due to jsdom limitations:
- CSS variable values cannot be directly tested (jsdom doesn't load CSS files)
- Tests verify theme class application instead of computed CSS values
- Actual CSS variable application is verified through visual testing and browser testing

## Related Files

- `src/lib/theme/theme-provider.tsx` - Theme provider component
- `src/lib/theme/use-theme.ts` - Theme hook
- `src/styles/tokens/colors.css` - Color design tokens
- `vitest.config.ts` - Vitest configuration
- `src/test/setup.ts` - Test setup and mocks
