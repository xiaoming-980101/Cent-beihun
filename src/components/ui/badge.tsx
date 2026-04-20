import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/utils/index";

/**
 * Badge Component - 标签组件
 *
 * Customized for Figma design specifications:
 * - Border radius: 9999px (fully rounded)
 * - Font size: 10px (text-tiny)
 * - Font weight: 700 (font-bold)
 * - Uppercase text
 * - Theme support: light/dark mode
 *
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-tiny font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
