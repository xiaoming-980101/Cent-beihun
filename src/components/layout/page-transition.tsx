import type { ReactNode } from 'react';
import { motion } from 'motion/react';

export interface PageTransitionProps {
  children: ReactNode;
  pageKey: string;
}

export function PageTransition({ children, pageKey }: PageTransitionProps) {
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="h-full min-h-0"
    >
      {children}
    </motion.div>
  );
}
