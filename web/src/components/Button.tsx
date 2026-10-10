import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  children,
  disabled,
  style,
  ...rest
}: Props) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--color-accent)',
      color: 'white',
      border: 'none',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--color-text)',
      border: '1px solid var(--color-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text)',
      border: 'none',
    },
    danger: {
      background: 'var(--color-danger)',
      color: 'white',
      border: 'none',
    },
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '15px' },
    lg: { padding: '14px 20px', fontSize: '16px' },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        borderRadius: 'var(--radius)',
        fontWeight: 500,
        transition: 'opacity 0.15s',
        opacity: disabled || loading ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        ...styles[variant],
        ...sizes[size],
        ...style,
      }}
      {...rest}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
}