// ============================================================
// CarnetTicketsBackground.tsx — Carnets/tickets cayendo
// Referencia: BLAWAN / SA 19.03.2011 (moodboard BRAND.md)
// SVG puro, sin assets. Capa decorativa fullscreen.
// ============================================================
import { View, StyleSheet } from 'react-native';
import Svg, { G, Rect, Line, Text as SvgText } from 'react-native-svg';

type Ticket = {
  x: number; y: number; w: number; h: number;
  rot: number; op: number;
  label?: string; sub?: string;
  barcode?: boolean;
};

// Coordenadas en viewBox 400x900 (escala con la pantalla)
const TICKETS: Ticket[] = [
  { x: -40,  y: 90,   w: 300, h: 42, rot: -32, op: 0.10, label: 'IDKFREE',           sub: 'ALDEA · v1 · 2023' },
  { x: 220,  y: 180,  w: 260, h: 38, rot: 28,  op: 0.10, label: 'SOBERANÍA DIGITAL', sub: 'N° IDK-0001-A' },
  { x: 40,   y: 320,  w: 280, h: 40, rot: -68, op: 0.04, label: 'TU CUENTA · TUYA',  barcode: true },
  { x: -60,  y: 460,  w: 320, h: 44, rot: 18,  op: 0.12, label: 'SA 19.03.2023',     sub: 'HABANA · CU' },
  { x: 180,  y: 560,  w: 240, h: 36, rot: -22, op: 0.04, label: 'PÁNICO · FÉNIX',    barcode: true },
  { x: 20,   y: 700,  w: 300, h: 42, rot: 42,  op: 0.10, label: 'RECUPERACIÓN',      sub: '3 QRs · 1 IDENTIDAD' },
  { x: 260,  y: 820,  w: 220, h: 34, rot: -15, op: 0.07, label: 'IDKFREE',           sub: '2023 → ∞' },
  { x: -30,  y: 900,  w: 280, h: 40, rot: -45, op: 0.05, label: 'BEEN HERE · DONE',  barcode: true },
  { x: 140,  y: 1020, w: 260, h: 38, rot: 60,  op: 0.06, label: 'ALDEA',             sub: 'v1.0.0' },
];

function BarcodeRow({ w, op }: { w: number; op: number }) {
  // Genera ~18 barras verticales pseudo-aleatorias (pero deterministas)
  const bars: number[] = [];
  let seed = w;
  for (let i = 0; i < 18; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    bars.push(1 + (seed % 3));
  }
  let cx = 8;
  return (
    <>
      {bars.map((bw, i) => {
        const r = <Rect key={i} x={cx} y={12} width={bw} height={14} fill="#FFF" opacity={op * 1.8} />;
        cx += bw + 3;
        return r;
      })}
    </>
  );
}

export function CarnetTicketsBackground() {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 1100" preserveAspectRatio="xMidYMid slice">
        {TICKETS.map((t, i) => (
          <G key={i} transform={`translate(${t.x} ${t.y}) rotate(${t.rot})`}>
            {/* Contenedor del ticket */}
            <Rect
              x={0} y={0} width={t.w} height={t.h}
              fill="#0A0A0A"
              stroke="#FFFFFF"
              strokeWidth={0.5}
              strokeOpacity={t.op * 1.5}
              opacity={t.op * 0.9}
            />
            {/* Franja interna superior (borde técnico) */}
            <Line
              x1={0} y1={t.h - 6} x2={t.w} y2={t.h - 6}
              stroke="#FFF" strokeWidth={0.5} opacity={t.op * 3}
            />

            {t.barcode ? (
              <BarcodeRow w={t.w} op={t.op} />
            ) : (
              <>
                {/* Label principal */}
                <SvgText
                  x={10} y={t.h * 0.55}
                  fontSize={Math.min(14, t.h * 0.4)}
                  fontFamily="monospace"
                  fontWeight="700"
                  fill="#FFFFFF"
                  opacity={t.op * 5}
                  letterSpacing={1}
                >
                  {t.label ?? ''}
                </SvgText>
                {/* Sub-label */}
                {t.sub ? (
                  <SvgText
                    x={10} y={t.h * 0.85}
                    fontSize={Math.min(7, t.h * 0.2)}
                    fontFamily="monospace"
                    fill="#FFFFFF"
                    opacity={t.op * 3.5}
                    letterSpacing={0.6}
                  >
                    {t.sub}
                  </SvgText>
                ) : null}
              </>
            )}

            {/* Puntos corner (HUD style) */}
            <Rect x={t.w - 6} y={3} width={2} height={2} fill="#FFF" opacity={t.op * 5} />
            <Rect x={3} y={t.h - 5} width={2} height={2} fill="#FFF" opacity={t.op * 5} />
          </G>
        ))}
      </Svg>
    </View>
  );
}
