import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/index";

/**
 * IconBackground Component - 图标背景容器组件
 * 
 * 用于功能图标的视觉包装，提供彩色背景容器
 * 
 * Features:
 * - 支持 4 种颜色变体: purple, blue, green, orange
 * - 支持 3 种尺寸: sm (40x40px), md (48x48px), lg (64x64px)
 * - 圆角: 16px
 * - 支持浅色/深色主题
 * 
 * Requirements: 4.5, 17.3
 */

const iconBackgroundVariants = cva(
  "rounded-2xl flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        purple: "bg-purple-100 dark:bg-purple-950",
        blue: "bg-blue-100 dark:bg-blue-950",
        green: "bg-green-100 dark:bg-green-950",
        orange: "bg-orange-100 dark:bg-orange-950",
      },
      size: {
        sm: "w-10 h-10",
        md: "w-12 h-12",
        lg: "w-16 h-16",
      },
    },
    defaultVariants: {
      variant: "purple",
      size: "md",
    },
  }
);

export interface IconBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof iconBackgroundVariants> {
  icon: React.ReactNode;
}

const IconBackground = React.forwardRef<HTMLDivElement, IconBackgroundProps>(
  ({ className, variant, size, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(iconBackgroundVariants({ variant, size, className }))}
        {...props}
      >
        {icon}
      </div>
    );
  }
);
IconBackground.displayName = "IconBackground";

export { IconBackground, iconBackgroundVariants };
