import React from 'react';

const Badge = React.memo(({ 
  children, 
  variant = 'secondary', 
  size = 'md',
  pill = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  };

  return (
    <span className={`badge bg-${variant} ${pill ? 'rounded-pill' : ''} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
