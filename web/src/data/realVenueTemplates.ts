export interface VenueTemplate {
  id: string;
  name: string;
  city: string;
  country: string;
  type: string;
  capacity: number;
  svgPath: string;
}

export const realVenueTemplates: VenueTemplate[] = [
  { id: 'coliseo_habana', name: 'Coliseo de la Ciudad Deportiva', city: 'La Habana', country: 'CU', type: 'coliseo', capacity: 15000, svgPath: 'M 400 50 A 200 200 0 1 1 399 50 Z M 400 100 A 150 150 0 1 1 399 100 Z' },
  { id: 'teatro_karl_marx', name: 'Teatro Karl Marx', city: 'La Habana', country: 'CU', type: 'teatro', capacity: 5500, svgPath: 'M 200 350 Q 400 150 600 350 L 550 350 Q 400 200 250 350 Z' },
  { id: 'estadio_latinoamericano', name: 'Estadio Latinoamericano', city: 'La Habana', country: 'CU', type: 'estadio', capacity: 55000, svgPath: 'M 150 150 L 650 150 L 650 300 L 150 300 Z' },
  { id: 'bernabeu', name: 'Estadio Santiago Bernabéu', city: 'Madrid', country: 'ES', type: 'estadio', capacity: 83186, svgPath: 'M 150 100 Q 400 50 650 100 L 650 350 Q 400 400 150 350 Z' },
  { id: 'teatro_real', name: 'Teatro Real', city: 'Madrid', country: 'ES', type: 'teatro', capacity: 1746, svgPath: 'M 200 350 Q 400 150 600 350 L 550 350 Q 400 200 250 350 Z' },
  { id: 'estadio_azteca', name: 'Estadio Azteca', city: 'Ciudad de México', country: 'MX', type: 'estadio', capacity: 87000, svgPath: 'M 150 150 L 650 150 L 650 300 L 150 300 Z' },
  { id: 'auditorio_nacional', name: 'Auditorio Nacional', city: 'Ciudad de México', country: 'MX', type: 'auditorio', capacity: 10000, svgPath: 'M 200 350 Q 400 150 600 350 L 550 350 Q 400 200 250 350 Z' }
];
