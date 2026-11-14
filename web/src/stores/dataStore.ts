import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Post { id: number; author: string; handle: string; time: string; content: string; likes: number; comments: number; isLiked: boolean; }
interface Message { id: number; sender: string; text: string; time: string; }
interface Event { id: number; title: string; location: string; date: string; seats: number; }

interface DataState {
  posts: Post[];
  messages: Message[];
  events: Event[];
  addPost: (content: string, author: string) => void;
  toggleLike: (id: number) => void;
  addMessage: (text: string, sender: string) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      posts: [
        { id: 1, author: 'EL_CREADOR', handle: '@edo_creator', time: 'Hace 2 horas', content: 'Acabo de configurar mi túnel de pagos con QvaPay. Es una locura lo fácil que es cobrar desde Cuba sin intermediarios. 💸🔥', likes: 124, comments: 18, isLiked: false },
        { id: 2, author: 'IDK_FREE_OS', handle: '@idkfree', time: 'Hace 5 horas', content: 'Actualización del sistema: El módulo de Ticketera ya está en vivo. Pronto podrás crear tus propios eventos y vender boletos con QR. 🎟️🚀', likes: 340, comments: 45, isLiked: false }
      ],
      messages: [
        { id: 1, sender: 'Creador_1', text: 'Hola, ¿cómo va el proyecto?', time: '12:30' },
        { id: 2, sender: 'Yo', text: '¡Todo marcha perfecto! Ya estamos en producción.', time: '12:35' }
      ],
      events: [
        { id: 1, title: 'Concierto Underground', location: 'La Habana, Cuba', date: '2026-12-01', seats: 500 }
      ],
      addPost: (content, author) => set((state) => ({
        posts: [{ id: Date.now(), author: author.toUpperCase(), handle: `@${author.toLowerCase()}`, time: 'Justo ahora', content, likes: 0, comments: 0, isLiked: false }, ...state.posts]
      })),
      toggleLike: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)
      })),
      addMessage: (text, sender) => set((state) => ({
        messages: [...state.messages, { id: Date.now(), sender, text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
      })),
      addEvent: (event) => set((state) => ({
        events: [...state.events, { ...event, id: Date.now() }]
      }))
    }),
    { name: 'idkfree-storage' }
  )
);
