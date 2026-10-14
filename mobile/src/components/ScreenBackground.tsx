import { useMemo } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, Rect, G } from 'react-native-svg';
import { useTheme } from '../stores/themeStore';

const { width: W, height: H } = Dimensions.get('window');

type Variant = 'neural' | 'grid' | 'radar' | 'wave' | 'film' | 'topo' | 'radio' | 'pulse' | 'particles' | 'hex';

interface Props {
  variant: Variant;
  opacity?: number;
}

export function ScreenBackground({ variant, opacity = 0.08 }: Props) {
  const theme = useTheme();
  const color = theme.accent;
  const content = useMemo(() => renderVariant(variant, color), [variant, color]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width={W} height={H} opacity={opacity}>
        {content}
      </Svg>
    </View>
  );
}

// Generadores de patrones
function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function renderVariant(variant: Variant, color: string) {
  switch (variant) {
    case 'neural': {
      // Red neuronal: nodos distribuidos + líneas
      const rand = seedRandom(42);
      const nodes: { x: number; y: number }[] = [];
      for (let i = 0; i < 18; i++) {
        nodes.push({ x: rand() * W, y: rand() * H });
      }
      return (
        <G>
          {nodes.map((a, i) =>
            nodes.slice(i + 1).map((b, j) => {
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (dist > 200) return null;
              return (
                <Line
                  key={`l-${i}-${j}`}
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={color} strokeWidth={1}
                />
              );
            })
          )}
          {nodes.map((n, i) => (
            <Circle key={`c-${i}`} cx={n.x} cy={n.y} r={3} fill={color} />
          ))}
        </G>
      );
    }

    case 'grid': {
      // Grid fino
      const step = 40;
      const lines: any[] = [];
      for (let x = 0; x < W; x += step) {
        lines.push(<Line key={`v-${x}`} x1={x} y1={0} x2={x} y2={H} stroke={color} strokeWidth={0.5} />);
      }
      for (let y = 0; y < H; y += step) {
        lines.push(<Line key={`h-${y}`} x1={0} y1={y} x2={W} y2={y} stroke={color} strokeWidth={0.5} />);
      }
      // Partículas
      const rand = seedRandom(7);
      const particles = Array.from({ length: 30 }, () => ({
        x: rand() * W, y: rand() * H, r: rand() * 2 + 0.5,
      }));
      return (
        <G>
          {lines}
          {particles.map((p, i) => (
            <Circle key={`p-${i}`} cx={p.x} cy={p.y} r={p.r} fill={color} />
          ))}
        </G>
      );
    }

    case 'radar': {
      // Ondas concéntricas desde centro
      const cx = W / 2;
      const cy = H * 0.35;
      return (
        <G>
          {[80, 140, 200, 260, 320, 380, 440].map((r, i) => (
            <Circle key={i} cx={cx} cy={cy} r={r} stroke={color} strokeWidth={0.8} fill="none" />
          ))}
          <Line x1={cx} y1={cy} x2={cx + 400} y2={cy - 200} stroke={color} strokeWidth={1} />
        </G>
      );
    }

    case 'wave': {
      // Waveform
      const paths: any[] = [];
      for (let row = 0; row < 6; row++) {
        const baseY = 100 + row * 100;
        let d = `M 0 ${baseY}`;
        for (let x = 0; x <= W; x += 20) {
          const y = baseY + Math.sin((x + row * 50) / 40) * (10 + row * 3);
          d += ` L ${x} ${y}`;
        }
        paths.push(<Path key={row} d={d} stroke={color} strokeWidth={0.8} fill="none" />);
      }
      return <G>{paths}</G>;
    }

    case 'film': {
      // Scanlines verticales
      return (
        <G>
          {Array.from({ length: Math.floor(W / 8) }, (_, i) => (
            <Line key={i} x1={i * 8} y1={0} x2={i * 8} y2={H} stroke={color} strokeWidth={0.3} />
          ))}
          {/* Perforaciones film arriba y abajo */}
          {Array.from({ length: 30 }, (_, i) => (
            <Rect key={`t-${i}`} x={i * (W / 30) + 5} y={8} width={10} height={4} fill={color} />
          ))}
          {Array.from({ length: 30 }, (_, i) => (
            <Rect key={`b-${i}`} x={i * (W / 30) + 5} y={H - 12} width={10} height={4} fill={color} />
          ))}
        </G>
      );
    }

    case 'topo': {
      // Curvas topográficas (huella)
      const curves: any[] = [];
      for (let i = 0; i < 12; i++) {
        const offset = i * 25;
        let d = `M ${-50} ${H / 2 + offset}`;
        for (let x = 0; x <= W + 50; x += 30) {
          const y = H / 2 + offset + Math.sin(x / 100 + i) * 20 + Math.cos(x / 60 + i * 2) * 15;
          d += ` L ${x} ${y}`;
        }
        curves.push(<Path key={i} d={d} stroke={color} strokeWidth={0.7} fill="none" />);
      }
      return <G>{curves}</G>;
    }

    case 'radio': {
      // Ondas de radio desde esquina superior
      return (
        <G>
          {[100, 180, 260, 340, 420, 500, 580, 660, 740].map((r, i) => (
            <Path
              key={i}
              d={`M 0 0 A ${r} ${r} 0 0 1 ${r} ${r}`}
              stroke={color} strokeWidth={0.8} fill="none"
            />
          ))}
        </G>
      );
    }

    case 'pulse': {
      // Anillos concéntricos
      const cx = W / 2;
      const cy = H / 2;
      return (
        <G>
          {Array.from({ length: 15 }, (_, i) => (
            <Circle key={i} cx={cx} cy={cy} r={(i + 1) * 30} stroke={color} strokeWidth={0.6} fill="none" />
          ))}
        </G>
      );
    }

    case 'particles': {
      // Nube de puntos
      const rand = seedRandom(99);
      const dots = Array.from({ length: 120 }, () => ({
        x: rand() * W, y: rand() * H, r: rand() * 2.5 + 0.3, op: rand() * 0.7 + 0.3,
      }));
      return (
        <G>
          {dots.map((d, i) => (
            <Circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} opacity={d.op} />
          ))}
        </G>
      );
    }

    case 'hex': {
      // Grid de hexágonos
      const hexes: any[] = [];
      const size = 30;
      const hw = size * 2;
      const hh = Math.sqrt(3) * size;
      for (let row = 0; row < Math.ceil(H / hh) + 1; row++) {
        for (let col = 0; col < Math.ceil(W / (hw * 0.75)) + 1; col++) {
          const cx = col * hw * 0.75;
          const cy = row * hh + (col % 2 ? hh / 2 : 0);
          let d = '';
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            d += (i === 0 ? 'M' : 'L') + ` ${x} ${y} `;
          }
          d += 'Z';
          hexes.push(<Path key={`${row}-${col}`} d={d} stroke={color} strokeWidth={0.5} fill="none" />);
        }
      }
      return <G>{hexes}</G>;
    }

    default:
      return null;
  }
}
