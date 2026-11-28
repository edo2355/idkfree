import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Asegúrate de tener: npm install qrcode.react

export default function TicketPreview() {
  const ticket = {
    id: 'TKT-9824-1102',
    eventName: 'Concierto IDKMEDIA Live',
    date: '15 DIC 2026',
    time: '20:00',
    venue: 'Estadio de la Habana',
    seats: 'A-12, A-13',
    price: 50.00,
    qrData: 'https://idkmedia.com/validate/TKT-9824-1102'
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00E5FF] to-[#0055FF] p-6 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">{ticket.eventName}</h2>
          <p className="text-sm opacity-80 tracking-widest">{ticket.id}</p>
        </div>

        {/* Details */}
        <div className="p-6 text-white space-y-4">
          <div className="flex justify-between border-b border-[#333] pb-4">
            <div>
              <p className="text-xs text-gray-500 font-bold">FECHA Y HORA</p>
              <p>{ticket.date} • {ticket.time}</p>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#333] pb-4">
            <div>
              <p className="text-xs text-gray-500 font-bold">RECINTO</p>
              <p>{ticket.venue}</p>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold">ASIENTOS</p>
              <p>{ticket.seats}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-bold">TOTAL</p>
              <p className="text-[#00E5FF] font-bold">${ticket.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="flex items-center h-8 relative">
          <div className="w-6 h-12 bg-[#050505] rounded-full absolute -left-3" />
          <div className="flex-1 border-t border-dashed border-[#333] mx-2" />
          <div className="w-6 h-12 bg-[#050505] rounded-full absolute -right-3" />
        </div>

        {/* QR */}
        <div className="p-6 flex flex-col items-center bg-[#0a0a0a]">
          <p className="text-xs text-gray-500 font-bold mb-4">ESCANEA PARA VALIDAR</p>
          <div className="bg-white p-3 rounded-xl">
            <QRCodeSVG value={ticket.qrData} size={180} />
          </div>
        </div>
      </div>
    </div>
  );
}
