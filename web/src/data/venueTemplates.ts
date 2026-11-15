export interface SeatZone {
  id: string;
  name: string;
  color: string;
  rows: number;
  seatsPerRow: number;
}

export interface VenueTemplate {
  id: string;
  name: string;
  city: string;
  country: string;
  type: 'stadium' | 'arena' | 'theater' | 'coliseum';
  capacity: number;
  zones: SeatZone[];
}

export const venueTemplates: VenueTemplate[] = [
  {
    id: 'bernabeu',
    name: 'Estadio Santiago Bernabéu',
    city: 'Madrid',
    country: 'España',
    type: 'stadium',
    capacity: 81044,
    zones: [
      { id: 'vip', name: 'VIP / Palco', color: 'bg-yellow-500', rows: 2, seatsPerRow: 10 },
      { id: 'preferente', name: 'Preferente', color: 'bg-brand-blue', rows: 4, seatsPerRow: 20 },
      { id: 'general', name: 'General', color: 'bg-gray-500', rows: 6, seatsPerRow: 30 },
    ]
  },
  {
    id: 'coliseo_habana',
    name: 'Coliseo de la Ciudad Deportiva',
    city: 'La Habana',
    country: 'Cuba',
    type: 'coliseum',
    capacity: 15000,
    zones: [
      { id: 'vip', name: 'Palco VIP', color: 'bg-yellow-500', rows: 2, seatsPerRow: 8 },
      { id: 'general', name: 'Grada General', color: 'bg-brand-blue', rows: 8, seatsPerRow: 25 },
    ]
  },
  {
    id: 'teatro_karl_marx',
    name: 'Teatro Karl Marx',
    city: 'La Habana',
    country: 'Cuba',
    type: 'theater',
    capacity: 5500,
    zones: [
      { id: 'platea', name: 'Platea Principal', color: 'bg-brand-blue', rows: 5, seatsPerRow: 15 },
      { id: 'balcon', name: 'Balcón', color: 'bg-gray-500', rows: 3, seatsPerRow: 20 },
    ]
  }
];
