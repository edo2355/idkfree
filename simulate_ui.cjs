const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
  bgDark: "\x1b[40m"
};

function clearScreen() {
  process.stdout.write('\x1Bc');
}

function drawNavbar() {
  console.log(`${colors.bgDark}${colors.white}======================================================================${colors.reset}`);
  console.log(`${colors.bgDark}${colors.bright}${colors.blue} [■] IDKFREE.OS ${colors.reset}${colors.bgDark}${colors.dim} | FEED | BUZZ | SHOP | TICKETERA | DASHBOARD ${colors.reset}`);
  console.log(`${colors.bgDark}${colors.white}======================================================================${colors.reset}`);
}

function drawFeed() {
  console.log(`\n${colors.bright}${colors.white} TIMELINE_SOCIAL ${colors.reset}${colors.dim} [FILTRAR]${colors.reset}\n`);
  
  console.log(`${colors.dim}┌────────────────────────────────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} ${colors.bgBlue}${colors.white} E ${colors.reset} ¿Qué está pasando en la red?                            ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}   ${colors.blue}[PUBLICAR]${colors.reset}                                                      ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}└────────────────────────────────────────────────────────────────────┘${colors.reset}\n`);

  // Post 1
  console.log(`${colors.dim}┌────────────────────────────────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} ${colors.blue}(E)${colors.reset} ${colors.bright}EL_CREADOR${colors.reset} ${colors.dim}@edo_creator • Hace 2h${colors.reset}                   ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}                                                                     ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} Acabo de configurar mi túnel de pagos con QvaPay. Es una locura    ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} lo fácil que es cobrar desde Cuba sin intermediarios. 💸🔥         ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}                                                                     ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} ${colors.red}♥ 124${colors.reset}  ${colors.dim}💬 18${colors.reset}                                        ${colors.dim}🔗 COMPARTIR${colors.reset} ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}└────────────────────────────────────────────────────────────────────┘${colors.reset}\n`);

  // Post 2
  console.log(`${colors.dim}┌────────────────────────────────────────────────────────────────────┐${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} ${colors.blue}(I)${colors.reset} ${colors.bright}IDK_FREE_OS${colors.reset} ${colors.dim}@idkfree • Hace 5h${colors.reset}                     ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}                                                                     ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} Actualización del sistema: El módulo de Ticketera ya está en vivo. ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} Pronto podrás crear tus propios eventos y vender boletos con QR.🎟️  ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset}                                                                     ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}│${colors.reset} ${colors.dim}♡ 340  💬 45${colors.reset}                                        ${colors.dim}🔗 COMPARTIR${colors.reset} ${colors.dim}│${colors.reset}`);
  console.log(`${colors.dim}└────────────────────────────────────────────────────────────────────┘${colors.reset}\n`);
}

function drawBottomNav() {
  console.log(`${colors.bgDark}======================================================================${colors.reset}`);
  console.log(`${colors.bgDark}${colors.dim}   [🏠 Home]         [⚡ Buzz]         [🛍️ Shop]         [🎟️ Ticket]         [👤 Perfil]   ${colors.reset}`);
  console.log(`${colors.bgDark}======================================================================${colors.reset}\n`);
}

function runSimulation() {
  clearScreen();
  console.log(`\n${colors.green}▶ INICIANDO SIMULACIÓN DE UI/UX EN TERMINAL...${colors.reset}`);
  
  setTimeout(() => {
    clearScreen();
    drawNavbar();
    drawFeed();
    drawBottomNav();
    console.log(`${colors.dim}💡 Tip: Esta es una representación visual de lo que ves en la web.${colors.reset}\n`);
  }, 1000);
}

runSimulation();
