import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, style, ...rest }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{
          fontSize: 11,
          letterSpacing: 1.5,
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 500,
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      )}
      <input
        {...rest}
        style={{
          padding: '14px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text)',
          fontSize: 15,
          fontFamily: 'var(--font-ui)',
          outline: 'none',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--text)';
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          rest.onBlur?.(e);
        }}
      />
    </div>
  );
}
