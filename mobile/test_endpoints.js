const readline = require('readline');

const API_URL = 'https://idkfree.onrender.com/api';
let authToken = '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function simularLogin() {
  console.log('\n🔐 [SIMULANDO PANTALLA DE LOGIN]');
  const email = await askQuestion('Ingresa tu email: ');
  const password = await askQuestion('Ingresa tu contraseña: ');

  console.log('📡 Enviando petición a Render...');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ ERROR DEL SERVIDOR (${res.status}):`, data.error || data);
      return false;
    }

    authToken = data.accessToken;
    console.log('✅ LOGIN EXITOSO. Token recibido:', authToken.substring(0, 15) + '...');
    return true;
  } catch (error) {
    console.error('❌ ERROR DE RED:', error.message);
    return false;
  }
}

async function simularEnvio() {
  console.log('\n💸 [SIMULANDO PANTALLA DE ENVIAR DINERO]');
  const method = await askQuestion('Método (idkfree/qvapay/transfermovil/paypal): ');
  const amount = await askQuestion('Monto a enviar (ej. 10): ');
  const destination = await askQuestion('Destinatario (ej. @usuario o 5XXXXXXX): ');

  console.log(`📡 Enviando $${amount} a ${destination} vía ${method}...`);
  try {
    const res = await fetch(`${API_URL}/payments/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      },
      body: JSON.stringify({ 
        provider: method, 
        amount: parseFloat(amount), 
        receiver_account: destination 
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ ERROR AL ENVIAR (${res.status}):`, data.error || data);
      return;
    }
    
    console.log('✅ ENVÍO EXITOSO:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

async function main() {
  console.log('🚀 INICIANDO SIMULACIÓN DE FLUJO IDKMEDIA');
  const loggedIn = await simularLogin();
  
  if (loggedIn) {
    await simularEnvio();
  }
  
  console.log('\n🏁 Simulación terminada.');
  rl.close();
}

main();
