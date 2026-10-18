import { useState, useEffect, useMemo } from 'react';

type Variant = 'neural' | 'grid' | 'radar' | 'wave' | 'film' | 'topo' | 'radio' | 'pulse' | 'particles' | 'hex';

interface Props {
  variant: Variant;
  opacity?: number;
}

export function ScreenBackground({ variant, opacity = 0.08 }: Props) {
  const [dims, setDims] = useState({ W: window.innerWidth, H: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setDims({ W: window.innerWidth, H: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const color = 'var(--accent)'; // Usa el violeta de tu tema
  const content = useMemo(() => renderVariant(variant, color, dims.W, dims.H), [variant, color, dims]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
      <svg width="100%" height="100%" opacity={opacity} viewBox={`0 0 ${dims.W} ${dims.H}`}>
        {content}
      </svg>
    </div>
  );
}

function seedRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function renderVariant(variant: Variant, color: string, W: number, H: number) {
  switch (variant) {
    case 'neural': {
      const rand = seedRandom(42);
      const nodes: { x: number; y: number }[] = [];
      for (let i = 0; i < 18; i++) {
        nodes.push({ x: rand() * W, y: rand() * H });
      }
      return (
        <g>
          {nodes.map((a, i) =>
            nodes.slice(i + 1).map((b, j) => {
              const dist = Math.hypot(a.x - b.x, a.y - b.y);
              if (dist > 200) return null;
              return <line key={`l-${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={1} />;
            })
          )}
          {nodes.map((n, i) => (
            <circle key={`c-${i}`} cx={n.x} cy={n.y} r={3} fill={color} />
          ))}
        </g>
      );
    }
    case 'grid': {
      const step = 40;
      const lines: any[] = [];
      for (let x = 0; x < W; x += step) {
        lines.push(<line key={`v-${x}`} x1={x} y1={0} x2={x} y2={H} stroke={color} strokeWidth={0.5} />);
      }
      for (let y = 0; y < H; y += step) {
        lines.push(<line key={`h-${y}`} x1={0} y1={y} x2={W} y2={y} stroke={color} strokeWidth={0.5} />);
      }
      return <g>{lines}</g>;
    }
    case 'topo': {
      const curves: any[] = [];
      for (let i = 0; i < 12; i++) {
        const offset = i * 25;
        let d = `M ${-50} ${H / 2 + offset}`;
        for (let x = 0; x <= W + 50; x += 30) {
          const y = H / 2 + offset + Math.sin(x / 100 + i) * 20 + Math.cos(x / 60 + i * 2) * 15;
          d += ` L ${x} ${y}`;
        }
        curves.push(<path key={i} d={d} stroke={color} strokeWidth={0.7} fill="none" />);
      }
      return <g>{curves}</g>;
    }
    case 'radio': {
      return (
        <g>
          {[100, 180, 260, 340, 420, 500, 580, 660, 740].map((r, i) => (
            <path key={i} d={`M 0 0 A ${r} ${r} 0 0 1 ${r} ${r}`} stroke={color} strokeWidth={0.8} fill="none" />
          ))}
        </g>
      );
    }
    default:
      return null;
  }
}
