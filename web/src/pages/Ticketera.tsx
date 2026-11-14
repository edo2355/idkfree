import { useState } from 'react';
import { Plus, MapPin, Users } from 'lucide-react';

export default function Ticketera() {
  const [venues, setVenues] = useState([
    { id: '1', name: 'Estadio Monumental', location: 'Santiago de Cuba', sections: 2 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ticketera</h1>
          <p className="text-slate-400">Gestiona tus eventos, estadios y asientos.</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={18} /> Crear Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-cyan-500/50 transition-colors cursor-pointer">
            <h3 className="text-xl font-semibold text-white mb-2">{venue.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1"><MapPin size={16} /> {venue.location}</span>
              <span className="flex items-center gap-1"><Users size={16} /> {venue.sections} Secciones</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
