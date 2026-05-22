import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'editorial' | 'low';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'editorial',
  className = '',
  ...props
}) => {
  const baseStyle = "rounded-[1.5rem] transition-all duration-300";
  
  const shadowVariants = {
    flat: "bg-surface-container border border-outline-variant/20",
    editorial: "bg-surface-container-low hover:bg-surface-container hover:shadow-editorial border border-outline-variant/10",
    low: "bg-surface-container-lowest border border-outline-variant/15 editorial-shadow",
  };

  return (
    <div
      className={`${baseStyle} ${shadowVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
