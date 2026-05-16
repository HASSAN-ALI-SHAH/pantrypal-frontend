import { forwardRef, useState } from 'react';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  iconRight,
  className = '',
  disabled,
  ...props
}, ref) => {
  const [ripple, setRipple] = useState(false);

  const variantClass = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    'outline-white': 'btn-outline-white',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  }[variant] || 'btn-primary';

  const sizeClass = { sm: 'btn-sm', md: '', lg: 'btn-lg', icon: 'btn-icon' }[size] || '';

  const handleClick = (e) => {
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
    props.onClick?.(e);
  };

  return (
    <button
      ref={ref}
      {...props}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`btn ${variantClass} ${sizeClass} ${ripple ? 'btn-ripple' : ''} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : Icon && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {size !== 'icon' && children}
      {iconRight && !loading && <iconRight.type {...iconRight.props} size={16} />}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
