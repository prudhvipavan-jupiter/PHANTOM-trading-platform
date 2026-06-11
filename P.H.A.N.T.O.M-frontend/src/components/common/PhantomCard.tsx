import React from 'react';
import { motion } from 'framer-motion';

interface PhantomCardProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PhantomCard: React.FC<PhantomCardProps> = ({
  variant = 'default',
  size = 'md',
  interactive = false,
  loading = false,
  children,
  className = '',
  onClick
}) => {
  const baseClasses = 'phantom-card';
  const variantClasses = `phantom-card-${variant}`;
  const sizeClasses = `phantom-card-${size}`;
  const interactiveClasses = interactive ? 'phantom-card-interactive' : '';
  const loadingClasses = loading ? 'phantom-card-loading' : '';

  const cardClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${interactiveClasses} ${loadingClasses} ${className}`.trim();

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: interactive ? { y: -4, scale: 1.02 } : {},
    tap: interactive ? { scale: 0.98 } : {}
  };

  return (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onClick}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
          <div className="phantom-loading-spinner" />
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default PhantomCard; 