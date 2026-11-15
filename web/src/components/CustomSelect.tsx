import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

export default function CustomSelect({ options, value, onChange, placeholder, label }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar opciones según búsqueda
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="text-xs font-mono text-gray-500 block mb-2 uppercase">{label}</label>
      
      {/* Botón que simula el Input */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-gray-50 dark:bg-[#000] border p-3 rounded text-left transition-colors ${
          isOpen ? 'border-brand-blue ring-1 ring-brand-blue/50' : 'border-gray-300 dark:border-brand-border hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <span className={`text-sm ${selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Lista Desplegable */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Buscador */}
          <div className="p-2 border-b border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#0a0a0a]">
            <div className="flex items-center bg-white dark:bg-[#000] border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5">
              <Search size={14} className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white w-full"
                autoFocus
              />
            </div>
          </div>

          {/* Opciones */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 font-mono">No se encontraron resultados.</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors hover:bg-gray-100 dark:hover:bg-[#222] ${
                    value === option.value ? 'bg-brand-blue/10 text-brand-blue font-bold' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={14} />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
