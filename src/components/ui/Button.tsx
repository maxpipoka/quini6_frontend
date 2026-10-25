import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200 dark:focus:ring-primary-800',
  secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-200 dark:focus:ring-secondary-800',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 focus:ring-primary-200 dark:focus:ring-primary-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
};

const loadingSpinner = (
  <span className="inline-flex items-center gap-2">
    <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span>Cargando...</span>
  </span>
);

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  href,
  children,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  onClick,
}) => {
  const isLink = !!href;
  const baseClasses = `inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isLink ? 'text-center' : ''}`;
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  if (isLink) {
    return (
      <a
        href={href}
        className={combinedClasses}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        aria-busy={loading}
        onClick={handleClick}
      >
        {loading ? loadingSpinner : children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      onClick={handleClick}
    >
      {loading ? loadingSpinner : children}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;