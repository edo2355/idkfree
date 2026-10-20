export default function Users() {
  return (
    <div>
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>Gestión de Usuarios</h1>
      <div style={{ background: '#181b21', borderRadius: '10px', border: '1px solid #2a2e39', padding: '20px' }}>
        <p style={{ color: '#a0a5b1' }}>Aquí se cargará la tabla de usuarios conectada a Turso.</p>
        <button style={{ background: '#00f2fe', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          + Añadir Usuario
        </button>
      </div>
    </div>
  );
}
