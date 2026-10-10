// IDKFREE — Theme Dark
// Paleta oficial: negro #050505, blanco puro, grises, purple y cyan

export const darkTheme = {
  // Fondos
  bg: "#050505",
  surface: "#0F0F0F",
  surfaceElevated: "#1A1A1A",

  // Texto
  text: "#FFFFFF",
  textMuted: "#A3A3A3",
  textSubtle: "#5F5F5F",

  // Acento (default: purple)
  accent: "#A855F7",
  accentHover: "#C084FC",

  // Acento secundario
  accentAlt: "#22D3EE",

  // Semánticos
  danger: "#EF4444",
  success: "#22C55E",
  warning: "#F59E0B",

  // Bordes y divisores
  border: "#262626",
  borderStrong: "#404040",
};

export type Theme = typeof darkTheme;
