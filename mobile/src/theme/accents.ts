// IDKFREE — 10 colores curados de acento

export const ACCENTS = {
  blanco:  { light: "#000000", dark: "#FFFFFF", name: "Blanco" },
  negro:   { light: "#000000", dark: "#FFFFFF", name: "Negro" },
  rojo:    { light: "#DC2626", dark: "#EF4444", name: "Rojo" },
  azul:    { light: "#2563EB", dark: "#3B82F6", name: "Azul" },
  verde:   { light: "#16A34A", dark: "#22C55E", name: "Verde" },
  dorado:  { light: "#C9A961", dark: "#D9B975", name: "Dorado" },
  violeta: { light: "#7C3AED", dark: "#A78BFA", name: "Violeta" },
  coral:   { light: "#F97362", dark: "#FB9A85", name: "Coral" },
  menta:   { light: "#10B981", dark: "#34D399", name: "Menta" },
  mostaza: { light: "#CA8A04", dark: "#EAB308", name: "Mostaza" },
} as const;

export type AccentName = keyof typeof ACCENTS;
export const DEFAULT_ACCENT: AccentName = "dorado";

export function getAccent(name: AccentName, mode: "light" | "dark"): string {
  return ACCENTS[name][mode];
}
