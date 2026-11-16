import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, ArrowRight, Loader2, Package, Tag, Star, ShieldCheck, Plus, Edit, Trash2, X } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

export default function Catalog() {
  const { showToast } = useUIStore();
  const { token } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'explore' | 'my-products'>('explore');
  
  // Filtros
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [type, setType] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`https://idkfree.onrender.com/api/catalog/products?category=${category}&type=${type}`);
        if (res.ok) setProducts(await res.json());
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProducts();
  }, [category, type]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-[#1a1a1a] pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
            <ShoppingBag size={28} className="text-brand-blue" /> IDK_MARKETPLACE
          </h1>
          <p className="text-gray-500 text-sm mt-1">Descubre productos, servicios y talentos globales.</p>
        </div>
        <button onClick={() => showToast('Formulario de creación en el siguiente paso', 'info')} className="bg-brand-blue hover:bg-blue-600 text-white font-bold font-mono text-sm px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
          <Plus size={16} /> VENDER PRODUCTO
        </button>
      </div>

      {/* Tabs y Filtros Premium */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-gray-100 dark:bg-[#111] p-1 rounded-lg">
          <button onClick={() => setActiveTab('explore')} className={`px-6 py-2 text-sm font-mono font-bold rounded-md transition-colors ${activeTab === 'explore' ? 'bg-white dark:bg-[#222] text-brand-blue shadow-sm' : 'text-gray-500'}`}>Explorar</button>
          <button onClick={() => setActiveTab('my-products')} className={`px-6 py-2 text-sm font-mono font-bold rounded-md transition-colors ${activeTab === 'my-products' ? 'bg-white dark:bg-[#222] text-brand-blue shadow-sm' : 'text-gray-500'}`}>Mis Ventas</button>
        </div>

        <div className="flex flex-1 gap-2 w-full md:w-auto">
          <div className="flex-1 flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-lg px-4 py-2">
            <Search size={16} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Buscar en el catálogo..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-lg px-4 py-2 text-sm font-mono text-gray-500 outline-none">
            <option value="all">Todas las Categorías</option>
            <option value="digital">Digital</option>
            <option value="fisico">Físico</option>
            <option value="servicio">Servicios</option>
          </select>
        </div>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-2xl overflow-hidden group hover:border-brand-blue transition-all duration-300 shadow-sm hover:shadow-xl relative">
              
              {/* Badges de Estado (Premium) */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {product.is_featured === 1 && <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 rounded shadow-md flex items-center gap-1"><Star size={10}/> DESTACADO</span>}
                <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-800 dark:text-white text-[10px] font-mono px-2 py-1 rounded shadow-sm border border-gray-200 dark:border-gray-700">{product.product_type.toUpperCase()}</span>
              </div>

              {/* Imagen */}
              <div className="h-48 bg-gray-100 dark:bg-[#111] relative overflow-hidden">
                {product.image_url ? (
                  <img src={`https://idkfree.onrender.com${product.image_url}`} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700"><Package size={48} /></div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate pr-2">{product.title}</h3>
                  <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">@{product.seller_alias}</span>
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <p className="text-2xl font-black text-brand-blue">${product.price}</p>
                  {product.discount_price && <p className="text-sm text-gray-400 line-through mb-1">${product.discount_price}</p>}
                </div>
                <button onClick={() => showToast('Módulo de carrito en desarrollo', 'info')} className="w-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-mono text-xs py-3 rounded-lg hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2">
                  <ShoppingBag size={14} /> COMPRAR AHORA
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
