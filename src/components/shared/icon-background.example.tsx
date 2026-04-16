/**
 * IconBackground Component Usage Examples
 * 
 * This file demonstrates how to use the IconBackground component
 * with different variants and sizes.
 * 
 * Requirements: 4.5, 17.3
 */

import { Gift, Users, CheckSquare, DollarSign } from 'lucide-react';
import { IconBackground } from './icon-background';

export function IconBackgroundExamples() {
  return (
    <div className="p-8 space-y-8">
      {/* Color Variants */}
      <section>
        <h2 className="text-xl font-bold mb-4">Color Variants</h2>
        <div className="flex gap-4">
          <IconBackground 
            icon={<Gift className="w-6 h-6 text-purple-600" />} 
            variant="purple"
          />
          <IconBackground 
            icon={<Users className="w-6 h-6 text-blue-600" />} 
            variant="blue"
          />
          <IconBackground 
            icon={<CheckSquare className="w-6 h-6 text-green-600" />} 
            variant="green"
          />
          <IconBackground 
            icon={<DollarSign className="w-6 h-6 text-orange-600" />} 
            variant="orange"
          />
        </div>
      </section>

      {/* Size Variants */}
      <section>
        <h2 className="text-xl font-bold mb-4">Size Variants</h2>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <IconBackground 
              icon={<Gift className="w-4 h-4 text-purple-600" />} 
              variant="purple"
              size="sm"
            />
            <p className="text-xs mt-2">Small (40x40px)</p>
          </div>
          <div className="text-center">
            <IconBackground 
              icon={<Gift className="w-6 h-6 text-purple-600" />} 
              variant="purple"
              size="md"
            />
            <p className="text-xs mt-2">Medium (48x48px)</p>
          </div>
          <div className="text-center">
            <IconBackground 
              icon={<Gift className="w-8 h-8 text-purple-600" />} 
              variant="purple"
              size="lg"
            />
            <p className="text-xs mt-2">Large (64x64px)</p>
          </div>
        </div>
      </section>

      {/* In Feature Cards */}
      <section>
        <h2 className="text-xl font-bold mb-4">In Feature Cards</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 border rounded-xl bg-white dark:bg-gray-900">
            <IconBackground 
              icon={<Gift className="w-6 h-6 text-purple-600" />} 
              variant="purple"
            />
            <h3 className="text-lg font-bold mt-4">礼金簿</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              精准记录每一份礼金
            </p>
          </div>
          <div className="p-5 border rounded-xl bg-white dark:bg-gray-900">
            <IconBackground 
              icon={<Users className="w-6 h-6 text-blue-600" />} 
              variant="blue"
            />
            <h3 className="text-lg font-bold mt-4">亲友管理</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              管理宾客名单和邀请状态
            </p>
          </div>
        </div>
      </section>

      {/* Dark Mode Support */}
      <section className="dark">
        <h2 className="text-xl font-bold mb-4 text-white">Dark Mode Support</h2>
        <div className="flex gap-4 p-4 bg-gray-900 rounded-xl">
          <IconBackground 
            icon={<Gift className="w-6 h-6 text-purple-400" />} 
            variant="purple"
          />
          <IconBackground 
            icon={<Users className="w-6 h-6 text-blue-400" />} 
            variant="blue"
          />
          <IconBackground 
            icon={<CheckSquare className="w-6 h-6 text-green-400" />} 
            variant="green"
          />
          <IconBackground 
            icon={<DollarSign className="w-6 h-6 text-orange-400" />} 
            variant="orange"
          />
        </div>
      </section>
    </div>
  );
}
