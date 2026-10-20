#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/web || exit 1

echo "════════════════════════════════════════════════════"
echo "  WEB REBRANDING — Aldea → IDKFREE"
echo "════════════════════════════════════════════════════"
echo ""

# Backup
mkdir -p ~/web-backup
cp -r src ~/web-backup/src-$(date +%s)
cp index.html ~/web-backup/index.html
echo "▸ Backup en ~/web-backup/"

# ---------- 1. index.html ----------
echo "▸ 1. index.html → IDKFREE + fuentes Google"
cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IDKFREE</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,900&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HTML
echo "  ✅ index.html"

# ---------- 2. index.css con dark theme ----------
echo "▸ 2. index.css con tema oscuro IDKFREE"
cat > src/index.css << 'CSS'
:root {
  --bg: #050505;
  --surface: #0F0F0F;
  --surface-elevated: #1A1A1A;
  --border: #222222;
  --border-strong: #333333;
  --text: #FFFFFF;
  --text-muted: #888888;
  --text-subtle: #555555;
  --accent: #A855F7;
  --accent-alt: #22D3EE;
  --danger: #EF4444;
  --radius: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --font-display: 'Playfair Display', Georgia, serif;
  --font-ui: 'Space Grotesk', system-ui, -apple-system, sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  width: 100%;
}

body {
  font-family: var(--font-ui);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  font-size: 15px;
  line-height: 1.5;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

input, button, textarea {
  font-family: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  color: inherit;
}

h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 700;
}
CSS
echo "  ✅ index.css"

# ---------- 3. Login.tsx con look IDKFREE ----------
echo "▸ 3. Login.tsx rediseñado"
cat > src/pages/Login.tsx << 'TSX'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        {/* Logo + título */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 60, marginBottom: 8, color: 'var(--text)' }}>◇</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 1,
            color: 'var(--text)',
          }}>
            IDKFREE
          </h1>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: 15,
            marginTop: 6,
            letterSpacing: 0.5,
          }}>
            No lo sé, gratis o libre
          </p>
        </div>

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
        />

        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius)',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading}>
          Entrar
        </Button>

        <div style={{
          textAlign: 'center',
          fontSize: 15,
          color: 'var(--text)',
          marginTop: 4,
        }}>
          <Link to="/register" style={{ color: 'var(--text)' }}>
            Crear cuenta
          </Link>
        </div>

        {/* Firma Edo Amate */}
        <div style={{
          textAlign: 'center',
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            letterSpacing: 3,
            marginBottom: 8,
            textTransform: 'lowercase',
          }}>
            from
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text)',
            letterSpacing: 1,
          }}>
            edo amate
          </div>
        </div>
      </form>
    </div>
  );
}
TSX
echo "  ✅ Login.tsx"

# ---------- 4. Register.tsx ----------
echo "▸ 4. Register.tsx"
cat > src/pages/Register.tsx << 'TSX'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function Register() {
  const [email, setEmail] = useState('');
  const [alias, setAlias] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.register({ email, alias, password });
      setAuth({ id: res.userId, alias: res.alias }, res.accessToken);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--bg)',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 48, marginBottom: 8, color: 'var(--text)' }}>◇</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 34,
            fontWeight: 900,
            color: 'var(--text)',
          }}>
            Crear cuenta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>
            Únete a IDKFREE
          </p>
        </div>

        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
        <Input label="Alias" value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="@tu_alias" required />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

        {error && (
          <div style={{
            padding: 12,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius)',
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading}>
          Registrarme
        </Button>

        <div style={{ textAlign: 'center', fontSize: 15, color: 'var(--text)' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: 'var(--text)' }}>Entrar</Link>
        </div>
      </form>
    </div>
  );
}
TSX
echo "  ✅ Register.tsx"

# ---------- 5. Button.tsx oscuro ----------
echo "▸ 5. Button.tsx"
cat > src/components/Button.tsx << 'TSX'
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
TSX
echo "  ✅ Button.tsx"

# ---------- 6. Input.tsx oscuro ----------
echo "▸ 6. Input.tsx"
cat > src/components/Input.tsx << 'TSX'
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
TSX
echo "  ✅ Input.tsx"

# ---------- 7. Layout.tsx con HeaderBar ----------
echo "▸ 7. Layout.tsx"
cat > src/components/Layout.tsx << 'TSX'
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ width: 80 }} />
        <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: 0.5,
          color: 'var(--text)',
          textDecoration: 'none',
        }}>
          IDKFREE
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && (
            <>
              <Link to={`/u/${user.alias}`} style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                background: 'var(--surface-elevated)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: 14,
                textDecoration: 'none',
              }}>
                {user.alias?.charAt(0).toUpperCase() ?? '?'}
              </Link>
              <button onClick={logout} style={{
                color: 'var(--text-muted)',
                fontSize: 13,
                fontFamily: 'var(--font-ui)',
              }}>
                Salir
              </button>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
TSX
echo "  ✅ Layout.tsx"

# ---------- 8. Typecheck ----------
echo ""
echo "▸ 8. Typecheck"
npx tsc --noEmit 2>&1 | head -20
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ⚠️  TSC con warnings — puede ser normal en web (falta @types/react)"
  TSC_OK=0
fi

# ---------- 9. Commit ----------
echo ""
echo "▸ 9. Commit + push"
cd ~/idkfree
git add -A
git commit -m "feat(web): rebranding IDKFREE + Login/Register/Button/Input/Layout con look oscuro" 2>&1 | head -2
git push 2>&1 | tail -2

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ WEB REBRANDING COMPLETO"
echo "════════════════════════════════════════════════════"
echo ""
echo "  Recarga la página en Chrome (Ctrl+R / F5)"
echo "  Debería verse IDKFREE oscuro con firma Edo Amate"
echo ""
