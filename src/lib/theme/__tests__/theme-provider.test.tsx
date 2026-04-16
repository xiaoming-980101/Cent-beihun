import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../theme-provider';
import { useTheme } from '../use-theme';

// Test component that uses the theme
function TestComponent() {
  const { theme, setTheme, toggle } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('light')} data-testid="set-light">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">
        Set Dark
      </button>
      <button onClick={toggle} data-testid="toggle">
        Toggle
      </button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Remove any existing theme class
    document.documentElement.classList.remove('light', 'dark');
  });

  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Test Child');
  });

  it('uses default theme when no preference is stored', async () => {
    render(
      <ThemeProvider defaultTheme="system">
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme');
      expect(themeElement.textContent).toBeTruthy();
    });
  });

  it('applies custom storage key', async () => {
    const customKey = 'custom-theme-key';
    const user = userEvent.setup();
    
    render(
      <ThemeProvider storageKey={customKey} defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    // Change theme to trigger localStorage save
    await user.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      const stored = localStorage.getItem(customKey);
      expect(stored).toBe('dark');
    });
  });

  it('uses default storage key when not provided', async () => {
    const user = userEvent.setup();
    
    render(
      <ThemeProvider defaultTheme="light">
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
    });

    // Change theme to trigger localStorage save
    await user.click(screen.getByTestId('set-dark'));

    await waitFor(() => {
      const stored = localStorage.getItem('wedding-app-theme');
      expect(stored).toBe('dark');
    });
  });
});
