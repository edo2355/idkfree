import { useState } from 'react';
import { Search, Filter, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

export default function Catalog() {
  const { showToast } = useUIStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['Todos', 'Arte', 'Música', 'Tecnología', 'Servicios'];
  
  const products = [
    { id: 1, title: 'Beat Instrumental Exclusivo', price: 50, seller: 'EL_CREADOR', category: 'Música' },
    { id: 2, title: 'Diseño de Logo Minimalista', price: 25, seller: 'STUDIO_X', category: 'Arte' },
    { id: 3, title: 'Consultoría Cripto 1h', price: 80, seller: 'CRYPTO_PRO', category: 'Servicios' },
    { id: 4, title: 'Plantilla React Premium', price: 40, seller: 'DEV_MASTER', category: 'Tecnología' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-[#1a1a1a] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
            <ShoppingBag size={28} className="text-brand-blue" /> CATÁLOGO GLOBAL
          </h1>
          <p className="text-gray-500 text-sm mt-1">Explora productos y servicios de la comunidad.</p>
        </div>
        <button onClick={() => showToast('Creación de productos disponible pronto', 'info')} className="bg-brand-blue hover:bg-blue-600 text-white font-bold font-mono text-sm px-4 py-2 rounded transition-colors">
          PUBLICAR PRODUCTO
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-lg px-4 py-3">
          <Search size={18} className="text-gray-500 mr-3" />
          <input type="text" placeholder="Buscar en el catálogo..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] px-6 py-3 rounded-lg text-gray-500 hover:text-brand-blue transition-colors">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat.toLowerCase())}
            className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-colors ${activeCategory === cat.toLowerCase() ? 'bg-brand-blue text-white' : 'bg-gray-100 dark:bg-[#111] text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden group hover:border-brand-blue transition-colors">
            <div className="h-40 bg-gray-100 dark:bg-[#111] flex items-center justify-center relative">
              <ShoppingBag size={40} className="text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3 right-3 bg-brand-blue text-white text-[10px] font-mono px-2 py-1 rounded">${product.price} USD</span>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-brand-blue font-mono mb-1 uppercase tracking-wider">{product.category}</p>
              <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-1 truncate">{product.title}</h3>
              <p className="text-xs text-gray-500 mb-4">Por @{product.seller}</p>
              <button onClick={() => showToast('Módulo de compras en desarrollo', 'info')} className="w-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-mono text-xs py-2 rounded hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2">
                Ver Detalles <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
