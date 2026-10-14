#!/data/data/com.termux/files/usr/bin/bash
set +e
cd ~/idkfree/web || exit 1

echo "════════════════════════════════════════════════════"
echo "  WEB FIX — 4 errores TSC"
echo "════════════════════════════════════════════════════"
echo ""

# ---------- 1. tsconfig: añadir vite/client ----------
echo "▸ 1. tsconfig.json: añadir types"
python3 << 'PY'
import json, re
path = 'tsconfig.json'
src = open(path).read()
if '"types"' not in src:
    # Insertar types en compilerOptions
    src = src.replace(
        '"skipLibCheck": true,',
        '"skipLibCheck": true,\n    "types": ["vite/client"],',
        1
    )
    open(path, 'w').write(src)
    print("  ✅ types añadido")
else:
    print("  ·  ya estaba")
PY

# ---------- 2. Layout.tsx: logout → clearAuth ----------
echo "▸ 2. Layout.tsx: logout → clearAuth"
python3 << 'PY'
path = 'src/components/Layout.tsx'
src = open(path).read()
orig = src
src = src.replace(
    "const { user, logout } = useAuthStore();",
    "const user = useAuthStore((s) => s.user);\n  const logout = useAuthStore((s) => s.clearAuth);",
    1
)
if src != orig:
    open(path, 'w').write(src)
    print("  ✅ logout corregido")
else:
    print("  ⚠️  patrón no encontrado")
PY

# ---------- 3. Register.tsx: añadir PINs + auto-login ----------
echo "▸ 3. Register.tsx: PINs + auto-login"
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
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pinPanic, setPinPanic] = useState('');
  const [pinRecovery, setPinRecovery] = useState('');
  const [pinDestroy, setPinDestroy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (pinPanic.length !== 4 || pinRecovery.length !== 4 || pinDestroy.length !== 4) {
      setError('Los 3 PINs deben tener 4 dígitos');
      return;
    }

    setLoading(true);
    try {
      await api.auth.register({
        email,
        alias,
        name: name || undefined,
        password,
        pins: { panic: pinPanic, recovery: pinRecovery, destroy: pinDestroy },
      });
      // Register no devuelve token → auto-login
      const login = await api.auth.login(email, password);
      setAuth({ id: login.userId, alias: login.alias }, login.accessToken);
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
          gap: 16,
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
        <Input label="Nombre (opcional)" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />

        <div style={{ marginTop: 8, marginBottom: 4 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>
            PINs de seguridad (4 dígitos cada uno)
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Input label="Pánico" value={pinPanic} onChange={(e) => setPinPanic(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Recuperar" value={pinRecovery} onChange={(e) => setPinRecovery(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required />
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Destruir" value={pinDestroy} onChange={(e) => setPinDestroy(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" inputMode="numeric" maxLength={4} required />
            </div>
          </div>
          <p style={{ color: 'var(--text-subtle)', fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
            ⚠️ Anota estos PINs. Sin ellos no podrás recuperar tu cuenta.
          </p>
        </div>

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
echo "  ✅ Register.tsx reescrito"

# ---------- 4. Typecheck ----------
echo ""
echo "▸ 4. Typecheck"
npx tsc --noEmit 2>&1 | head -15
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "  ✅ TSC limpio"
  TSC_OK=1
else
  echo "  ❌ TSC con errores"
  TSC_OK=0
fi

# ---------- 5. Commit ----------
echo ""
if [ "$TSC_OK" = "1" ]; then
  echo "▸ 5. Commit + push"
  cd ~/idkfree
  git add -A
  git commit -m "fix(web): tsconfig vite/client + Layout logout + Register con PINs + auto-login" 2>&1 | head -2
  git push 2>&1 | tail -2
fi

echo ""
echo "════════════════════════════════════════════════════"
echo "  ✅ WEB FIX LISTO"
echo "════════════════════════════════════════════════════"
