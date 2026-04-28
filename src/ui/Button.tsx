import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-outline-secondary',
    danger: 'btn-outline-danger',
    success: 'btn-success',
    outline: 'btn-outline-primary',
  }[variant];

  return (
    <button className={`btn ${variantClass} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
