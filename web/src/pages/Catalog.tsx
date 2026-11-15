import { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
}

export default function Catalog() {
  const { showToast } = useUIStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://idkfree.onrender.com/api/shop/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-lg px-4 py-3">
          <Search size={18} className="text-gray-500 mr-3" />
          <input type="text" placeholder="Buscar en el catálogo..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" />
        </div>
        <button className="flex items-center justify-center gap-2 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] px-6 py-3 rounded-lg text-gray-500 hover:text-brand-blue transition-colors">
          <Filter size={18} /> Filtros
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 font-mono border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          No hay productos en el catálogo todavía.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl overflow-hidden group hover:border-brand-blue transition-colors">
              <div className="h-40 bg-gray-100 dark:bg-[#111] flex items-center justify-center relative">
                <ShoppingBag size={40} className="text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform" />
                <span className="absolute top-3 right-3 bg-brand-blue text-white text-[10px] font-mono px-2 py-1 rounded">${product.price} USD</span>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-1 truncate">{product.title}</h3>
                <p className="text-xs text-gray-500 mb-4">Stock: {product.stock}</p>
                <button onClick={() => showToast('Módulo de compras en desarrollo', 'info')} className="w-full bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white font-mono text-xs py-2 rounded hover:bg-brand-blue hover:text-white transition-colors flex items-center justify-center gap-2">
                  Ver Detalles <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
