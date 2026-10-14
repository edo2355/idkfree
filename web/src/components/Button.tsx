import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
}

export function Button({ size = 'md', loading, children, variant = 'primary', style, ...rest }: Props) {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13 },
    md: { padding: '12px 18px', fontSize: 14 },
    lg: { padding: '16px 24px', fontSize: 15 },
  };

  const variants = {
    primary: {
      background: 'var(--text)',
      color: 'var(--bg)',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--border)',
    },
  };

  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      style={{
        ...sizes[size],
        ...variants[variant],
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        letterSpacing: 0.5,
        cursor: loading ? 'wait' : 'pointer',
        opacity: rest.disabled ? 0.5 : 1,
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {loading ? '...' : children}
    </button>
  );
}
