export interface SeatPosition {
  number: number;
  label: string;
  x: number;
  y: number;
  seatType?: string;
}

export interface RowWithSeats {
  name: string;
  index: number;
  seats: SeatPosition[];
}

/**
 * Genera asientos en filas rectas paralelas
 */
export function computeStraightSeats(rows: number, seatsPerRow: number, startX = 100, startY = 100, gapX = 20, gapY = 25): RowWithSeats[] {
  const result: RowWithSeats[] = [];
  for (let r = 0; r < rows; r++) {
    const seats: SeatPosition[] = [];
    for (let s = 0; s < seatsPerRow; s++) {
      seats.push({
        number: s + 1,
        label: `${s + 1}`,
        x: startX + s * gapX,
        y: startY + r * gapY,
        seatType: 'normal'
      });
    }
    result.push({ name: String.fromCharCode(65 + r), index: r, seats });
  }
  return result;
}

/**
 * Genera asientos en abanico (radial) alrededor de un punto
 */
export function computeRadialSeats(
  rows: number, seatsPerRow: number,
  centerX: number, centerY: number,
  startRadius: number, radiusGap: number,
  startAngle: number, endAngle: number
): RowWithSeats[] {
  const result: RowWithSeats[] = [];
  const angleStep = (endAngle - startAngle) / (seatsPerRow - 1);
  
  for (let r = 0; r < rows; r++) {
    const seats: SeatPosition[] = [];
    const radius = startRadius + r * radiusGap;
    
    for (let s = 0; s < seatsPerRow; s++) {
      const angleDeg = startAngle + s * angleStep;
      const angleRad = (angleDeg * Math.PI) / 180;
      seats.push({
        number: s + 1,
        label: `${s + 1}`,
        x: centerX + radius * Math.cos(angleRad),
        y: centerY + radius * Math.sin(angleRad),
        seatType: 'normal'
      });
    }
    result.push({ name: String.fromCharCode(65 + r), index: r, seats });
  }
  return result;
}

/**
 * Arena 360°: anillo completo alrededor del escenario
 */
export function computeArena360Seats(rows: number, seatsPerRow: number, centerX: number, centerY: number, startRadius: number, radiusGap: number): RowWithSeats[] {
  const result: RowWithSeats[] = [];
  const angleStep = 360 / seatsPerRow;
  
  for (let r = 0; r < rows; r++) {
    const seats: SeatPosition[] = [];
    const radius = startRadius + r * radiusGap;
    for (let s = 0; s < seatsPerRow; s++) {
      const angleRad = (s * angleStep * Math.PI) / 180;
      seats.push({
        number: s + 1,
        label: `${s + 1}`,
        x: centerX + radius * Math.cos(angleRad),
        y: centerY + radius * Math.sin(angleRad),
        seatType: 'normal'
      });
    }
    result.push({ name: String.fromCharCode(65 + r), index: r, seats });
  }
  return result;
}
