import { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Search, Filter } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  
  // Formulario
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://idkfree.onrender.com/api/shop/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Debes iniciar sesión para crear un producto.');

    try {
      const res = await fetch('https://idkfree.onrender.com/api/shop/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, price: parseFloat(price), stock: parseInt(stock) })
      });

      if (res.ok) {
        setShowCreate(false);
        setTitle(''); setPrice(''); setStock('');
        fetchProducts(); // Recargar la lista
      } else {
        alert('Error creando producto');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-brand-border pb-4 transition-colors">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">IDK_SHOP</h1>
          <p className="text-gray-500 text-sm mt-1">Marketplace de la comunidad. Compra y vende con QvaPay.</p>
        </div>
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className="bg-brand-blue hover:bg-blue-600 text-white font-bold font-mono text-sm px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> {showCreate ? 'CANCELAR' : 'CREAR PRODUCTO'}
        </button>
      </div>

      {/* Formulario de Creación */}
      {showCreate && (
        <form onSubmit={handleCreateProduct} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-6 rounded-lg space-y-4 transition-colors">
          <h3 className="text-gray-900 dark:text-white font-bold mb-2">Publicar nuevo producto</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Nombre del producto" required value={title} onChange={e => setTitle(e.target.value)} className="bg-gray-100 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue" />
            <input type="number" step="0.01" placeholder="Precio (USD)" required value={price} onChange={e => setPrice(e.target.value)} className="bg-gray-100 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue" />
            <input type="number" placeholder="Stock disponible" required value={stock} onChange={e => setStock(e.target.value)} className="bg-gray-100 dark:bg-[#000] border border-gray-300 dark:border-brand-border p-3 rounded text-gray-900 dark:text-white outline-none focus:border-brand-blue" />
          </div>
          <button type="submit" className="bg-brand-blue text-white font-bold px-6 py-3 rounded hover:bg-blue-600 transition-colors">PUBLICAR EN EL SHOP</button>
        </form>
      )}

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 flex items-center bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded px-3 py-2 transition-colors">
          <Search size={16} className="text-gray-500 mr-2" />
          <input type="text" placeholder="Buscar productos..." className="bg-transparent border-none outline-none text-sm w-full text-gray-900 dark:text-white" />
        </div>
        <button className="p-2 border border-gray-200 dark:border-brand-border rounded text-gray-500 hover:text-brand-blue transition-colors"><Filter size={18} /></button>
      </div>

      {/* Grid de Productos */}
      {loading ? (
        <div className="text-center text-gray-500 font-mono py-12">CARGANDO INVENTARIO...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-500 font-mono py-12 border border-dashed border-gray-300 dark:border-brand-border rounded-lg">
          No hay productos en el marketplace todavía.<br/>¡Sé el primero en vender algo!
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg overflow-hidden group hover:border-brand-blue transition-colors">
              <div className="aspect-square bg-gray-100 dark:bg-[#000] flex items-center justify-center relative">
                <ShoppingBag size={48} className="text-gray-300 dark:text-gray-700 group-hover:scale-110 transition-transform" />
                <span className="absolute top-2 right-2 bg-brand-blue text-white text-[10px] font-mono px-2 py-1 rounded">${product.price}</span>
              </div>
              <div className="p-4">
                <h3 className="text-gray-900 dark:text-white font-bold text-sm truncate">{product.title}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">Stock: {product.stock}</p>
                <button className="w-full mt-4 bg-gray-100 dark:bg-brand-border text-gray-900 dark:text-white font-mono text-xs py-2 rounded hover:bg-brand-blue hover:text-white transition-colors">
                  COMPRAR AHORA
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
