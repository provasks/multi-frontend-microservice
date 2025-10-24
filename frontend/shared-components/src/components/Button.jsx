import React from 'react';

const Button = React.memo(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  };

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <i className={`${icon} me-1`}></i>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
