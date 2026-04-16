import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/utils";

export interface FloatingActionButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: ReactNode;
}

export function FloatingActionButton({
    className,
    children,
    icon,
    ...props
}: FloatingActionButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn("wedding-fab", className)}
            type="button"
            {...props}
        >
            {icon ?? children}
        </motion.button>
    );
}

