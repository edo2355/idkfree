export interface VenueTemplate {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  svgPath: string;
}

export const realVenueTemplates: VenueTemplate[] = [
  {
    id: 'bernabeu',
    name: 'Estadio Santiago Bernabéu',
    city: 'Madrid',
    country: 'España',
    capacity: 83186,
    svgPath: 'M 150 100 Q 400 50 650 100 L 650 350 Q 400 400 150 350 Z M 200 150 Q 400 110 600 150 L 600 300 Q 400 340 200 300 Z M 250 200 Q 400 170 550 200 L 550 250 Q 400 280 250 250 Z'
  },
  {
    id: 'coliseo_habana',
    name: 'Coliseo de la Ciudad Deportiva',
    city: 'La Habana',
    country: 'Cuba',
    capacity: 15000,
    svgPath: 'M 400 50 A 200 200 0 1 1 399 50 Z M 400 100 A 150 150 0 1 1 399 100 Z M 400 150 A 100 100 0 1 1 399 150 Z'
  },
  {
    id: 'teatro_karl_marx',
    name: 'Teatro Karl Marx',
    city: 'La Habana',
    country: 'Cuba',
    capacity: 5500,
    svgPath: 'M 200 350 Q 400 150 600 350 L 550 350 Q 400 200 250 350 Z M 250 300 Q 400 180 550 300 L 500 300 Q 400 220 300 300 Z'
  },
  {
    id: 'pedro_marrero',
    name: 'Estadio Pedro Marrero',
    city: 'La Habana',
    country: 'Cuba',
    capacity: 28000,
    svgPath: 'M 150 150 L 650 150 L 650 300 L 150 300 Z M 200 180 L 600 180 L 600 270 L 200 270 Z'
  }
];
