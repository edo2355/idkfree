const crypto = require('crypto');
const JWT_SECRET = 'DZE/NvgYaoVWmigR+orRimhcqWCrS+qtH6fT8ru768sUB9G8w+icRcON9IZVpA6k';

function base64url(source) {
  return Buffer.from(source).toString('base64url');
}

const header = { alg: 'HS256', typ: 'JWT' };
const encodedHeader = base64url(JSON.stringify(header));

const payload = { 
  sub: 'test-user-qvapay-123', // <-- CAMBIADO A "sub" PARA QUE COINCIDA CON EL MIDDLEWARE
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600 
};
const encodedPayload = base64url(JSON.stringify(payload));

const signature = crypto.createHmac('sha256', JWT_SECRET)
  .update(`${encodedHeader}.${encodedPayload}`)
  .digest('base64url');

const token = `${encodedHeader}.${encodedPayload}.${signature}`;
console.log('🔑 Token generado con éxito.');

fetch('https://idkfree.onrender.com/api/qvapay/create-invoice', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ amount: 5.00, description: 'Prueba de pago IDKfree' })
})
.then(async (res) => {
  console.log(`👉 Código HTTP: ${res.status}`);
  const data = await res.json();
  console.log('📦 Respuesta:', JSON.stringify(data, null, 2));
})
.catch(err => console.error('❌ Error de red:', err));
