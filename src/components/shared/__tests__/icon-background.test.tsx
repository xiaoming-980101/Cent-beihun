import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IconBackground } from '../icon-background';

/**
 * IconBackground Component Tests
 * 
 * Tests for the IconBackground component to ensure:
 * - Correct rendering with different variants
 * - Correct rendering with different sizes
 * - Proper icon rendering
 * - Theme support (light/dark mode)
 * 
 * Requirements: 4.5, 17.3
 */

describe('IconBackground Component', () => {
  it('renders with default props', () => {
    const { container } = render(
      <IconBackground icon={<div data-testid="test-icon">Icon</div>} />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toBeInTheDocument();
    expect(iconBg).toHaveClass('rounded-2xl');
    expect(iconBg).toHaveClass('flex');
    expect(iconBg).toHaveClass('items-center');
    expect(iconBg).toHaveClass('justify-center');
  });

  it('renders with purple variant (default)', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('bg-purple-100');
    expect(iconBg).toHaveClass('dark:bg-purple-950');
  });

  it('renders with blue variant', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} variant="blue" />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('bg-blue-100');
    expect(iconBg).toHaveClass('dark:bg-blue-950');
  });

  it('renders with green variant', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} variant="green" />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('bg-green-100');
    expect(iconBg).toHaveClass('dark:bg-green-950');
  });

  it('renders with orange variant', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} variant="orange" />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('bg-orange-100');
    expect(iconBg).toHaveClass('dark:bg-orange-950');
  });

  it('renders with sm size', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} size="sm" />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('w-10');
    expect(iconBg).toHaveClass('h-10');
  });

  it('renders with md size (default)', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('w-12');
    expect(iconBg).toHaveClass('h-12');
  });

  it('renders with lg size', () => {
    const { container } = render(
      <IconBackground icon={<div>Icon</div>} size="lg" />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('w-16');
    expect(iconBg).toHaveClass('h-16');
  });

  it('renders the icon content', () => {
    const { getByTestId } = render(
      <IconBackground icon={<div data-testid="test-icon">Test Icon</div>} />
    );
    
    expect(getByTestId('test-icon')).toBeInTheDocument();
    expect(getByTestId('test-icon')).toHaveTextContent('Test Icon');
  });

  it('accepts custom className', () => {
    const { container } = render(
      <IconBackground 
        icon={<div>Icon</div>} 
        className="custom-class"
      />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(
      <IconBackground 
        icon={<div>Icon</div>} 
        ref={ref as React.RefObject<HTMLDivElement>}
      />
    );
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies all variant and size combinations correctly', () => {
    const variants = ['purple', 'blue', 'green', 'orange'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;

    variants.forEach((variant) => {
      sizes.forEach((size) => {
        const { container } = render(
          <IconBackground 
            icon={<div>Icon</div>} 
            variant={variant}
            size={size}
          />
        );
        
        const iconBg = container.firstChild as HTMLElement;
        expect(iconBg).toBeInTheDocument();
        
        // Check variant classes
        expect(iconBg.className).toContain(`bg-${variant}-100`);
        expect(iconBg.className).toContain(`dark:bg-${variant}-950`);
        
        // Check size classes
        const sizeMap = { sm: '10', md: '12', lg: '16' };
        expect(iconBg.className).toContain(`w-${sizeMap[size]}`);
        expect(iconBg.className).toContain(`h-${sizeMap[size]}`);
      });
    });
  });
});
