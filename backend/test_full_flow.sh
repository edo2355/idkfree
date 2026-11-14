#!/bin/bash

# Usamos un correo diferente para evitar el error de "Usuario ya existe"
EMAIL="test_$(date +%s)@idkfree.dev"
ALIAS="test_flow_$(date +%s)"
PASSWORD="Password123"
API_URL="https://idkfree.onrender.com/api"

echo "═══════════════════════════════════════════════"
echo " 1. REGISTRANDO EN WAITLIST (DISPARA CORREO)"
echo "═══════════════════════════════════════════════"
curl -s -X POST "$API_URL/waitlist/join" \
  -H "Content-Type: application/json" \
  -d "{\"alias\":\"$ALIAS\", \"email\":\"$EMAIL\"}" | jq '.'
echo -e "\n👉 Revisa el correo en: $EMAIL\n"

echo "═══════════════════════════════════════════════"
echo " 2. REGISTRANDO USUARIO (AUTH + 3 PINS)"
echo "═══════════════════════════════════════════════"
REG_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\":\"$EMAIL\", 
    \"password\":\"$PASSWORD\", 
    \"alias\":\"$ALIAS\",
    \"secretPins\": [\"1234\", \"5678\", \"9012\"]
  }")
echo "$REG_RESPONSE" | jq '{userId, alias, accessToken: (.accessToken[0:20] + "...")}'

# Extraemos el accessToken del registro
TOKEN=$(echo $REG_RESPONSE | jq -r '.accessToken')

echo -e "\n═══════════════════════════════════════════════"
echo " 3. PROBANDO ENDPOINT PROTEGIDO (TRUST SCORE)"
echo "═══════════════════════════════════════════════"

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Token obtenido del registro exitosamente."
    curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/user/trust" | jq '.'
else
    echo -e "\n❌ No se pudo obtener el token."
fi

echo -e "\n═══════════════════════════════════════════════"
echo " 4. HACIENDO LOGIN (Prueba extra)"
echo "═══════════════════════════════════════════════"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}")

TOKEN_LOGIN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')

if [ "$TOKEN_LOGIN" != "null" ] && [ -n "$TOKEN_LOGIN" ]; then
    echo "✅ Login exitoso. Token: ${TOKEN_LOGIN:0:20}..."
else
    echo -e "❌ Error en el login. Respuesta: $LOGIN_RESPONSE"
fi
