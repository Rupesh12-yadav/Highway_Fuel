const Button = ({ children, variant = 'primary', size = 'md', disabled, loading, className = '', ...props }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium',
    ghost: 'text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium',
  };
  const sizes = { sm: 'text-sm px-3 py-1.5', md: '', lg: 'text-lg px-6 py-3' };
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
