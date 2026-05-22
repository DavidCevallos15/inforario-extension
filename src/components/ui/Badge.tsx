import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider select-none";

  const variants = {
    primary: "bg-primary-fixed text-on-primary-fixed-variant",
    secondary: "bg-secondary-container text-on-secondary-container",
    error: "bg-error-container text-error",
    success: "bg-success-container text-success", // Custom if success tokens exist, else HSL custom
    warning: "bg-warning-container text-warning",
    info: "bg-info-container text-info"
  };

  return (
    <span
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
