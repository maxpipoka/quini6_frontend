import React from 'react';
import { formatDrawNumber } from '../../lib/schemas';

// ============================================================================
// Types
// ============================================================================

export type NumberBallSize = 'sm' | 'md' | 'lg';
export type NumberBallVariant = 'primary' | 'secondary' | 'success' | 'warning';

export interface NumberBallProps {
  number: number;
  size?: NumberBallSize;
  variant?: NumberBallVariant;
  className?: string;
}

// ============================================================================
// Size and Variant configurations
// ============================================================================

const sizeClasses: Record<NumberBallSize, string> = {
  sm: 'w-6 h-6 text-caption',
  md: 'w-8 h-8 text-base-sm',
  lg: 'w-12 h-12 text-lg',
};

const variantClasses: Record<NumberBallVariant, string> = {
  primary: 'bg-primary-500 text-white border-primary-500',
  secondary: 'bg-secondary-500 text-white border-secondary-500',
  success: 'bg-success-500 text-white border-success-500',
  warning:
    'bg-warning-500 text-neutral-900 border-warning-500 dark:bg-warning-500 dark:text-neutral-900',
};

// ============================================================================
// NumberBall Component
// ============================================================================

export const NumberBall: React.FC<NumberBallProps> = ({
  number,
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  // Validate number range
  const validNumber = Math.max(0, Math.min(45, Math.floor(number)));
  const formattedNumber = formatDrawNumber(validNumber);

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full border-2 font-bold
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
      role="img"
      aria-label={`Número ${formattedNumber}`}
    >
      {formattedNumber}
    </span>
  );
};

export default NumberBall;
