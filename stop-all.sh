#!/data/data/com.termux/files/usr/bin/bash
# Detiene TODOS los servicios IDKFREE
echo "▸ Deteniendo servicios..."
pkill -f "dist/server.js" 2>/dev/null && echo "  ✅ backend detenido" || echo "  ·  backend no estaba"
pkill -f "expo start" 2>/dev/null && echo "  ✅ metro detenido"     || echo "  ·  metro no estaba"
pkill -f "termix" 2>/dev/null       && echo "  ✅ termix detenido"  || echo "  ·  termix no estaba"
pkill -f "sshd" 2>/dev/null         && echo "  ✅ sshd detenido"    || echo "  ·  sshd no estaba"
sleep 2
echo ""
echo "  RAM después:"
free -h | grep -E "Mem|Swap" | sed 's/^/    /'
