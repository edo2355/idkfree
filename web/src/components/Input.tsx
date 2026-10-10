import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, style, ...rest }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text)',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          padding: '10px 12px',
          fontSize: '15px',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius)',
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          outline: 'none',
          ...style,
        }}
        {...rest}
      />
      {hint && !error && (
        <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          {hint}
        </span>
      )}
      {error && (
        <span style={{ fontSize: '13px', color: 'var(--color-danger)' }}>
          {error}
        </span>
      )}
    </div>
  );
}