import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Gift } from 'lucide-react';
import { IconBackground } from '../index';

/**
 * IconBackground Integration Tests
 * 
 * Tests to verify the component can be imported and used
 * in real-world scenarios with actual icon libraries
 * 
 * Requirements: 4.5, 17.3
 */

describe('IconBackground Integration', () => {
  it('works with Lucide React icons', () => {
    const { container } = render(
      <IconBackground 
        icon={<Gift className="w-6 h-6 text-purple-600" />} 
        variant="purple"
      />
    );
    
    const iconBg = container.firstChild as HTMLElement;
    expect(iconBg).toBeInTheDocument();
    
    // Check that the Lucide icon is rendered
    const svgElement = iconBg.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('can be imported from index file', () => {
    // This test verifies the export works correctly
    expect(IconBackground).toBeDefined();
    expect(typeof IconBackground).toBe('object'); // forwardRef returns an object
  });

  it('renders correctly in a feature card context', () => {
    const { container, getByText } = render(
      <div className="p-5 border rounded-xl">
        <IconBackground 
          icon={<Gift className="w-6 h-6 text-purple-600" />} 
          variant="purple"
          size="md"
        />
        <h3 className="text-lg font-bold mt-4">礼金簿</h3>
        <p className="text-xs text-gray-600 mt-1">精准记录每一份礼金</p>
      </div>
    );
    
    expect(getByText('礼金簿')).toBeInTheDocument();
    expect(getByText('精准记录每一份礼金')).toBeInTheDocument();
    
    const iconBg = container.querySelector('.rounded-2xl');
    expect(iconBg).toBeInTheDocument();
    expect(iconBg).toHaveClass('bg-purple-100');
  });

  it('supports all color variants with real icons', () => {
    const variants = [
      { variant: 'purple' as const, color: 'purple' },
      { variant: 'blue' as const, color: 'blue' },
      { variant: 'green' as const, color: 'green' },
      { variant: 'orange' as const, color: 'orange' },
    ];

    variants.forEach(({ variant, color }) => {
      const { container } = render(
        <IconBackground 
          icon={<Gift className={`w-6 h-6 text-${color}-600`} />} 
          variant={variant}
        />
      );
      
      const iconBg = container.firstChild as HTMLElement;
      expect(iconBg).toHaveClass(`bg-${color}-100`);
      expect(iconBg).toHaveClass(`dark:bg-${color}-950`);
    });
  });

  it('supports all size variants with appropriate icon sizes', () => {
    const sizes = [
      { size: 'sm' as const, iconSize: 'w-4 h-4' },
      { size: 'md' as const, iconSize: 'w-6 h-6' },
      { size: 'lg' as const, iconSize: 'w-8 h-8' },
    ];

    sizes.forEach(({ size, iconSize }) => {
      const { container } = render(
        <IconBackground 
          icon={<Gift className={iconSize} />} 
          size={size}
        />
      );
      
      const iconBg = container.firstChild as HTMLElement;
      expect(iconBg).toBeInTheDocument();
      
      const svg = iconBg.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
