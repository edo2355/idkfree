import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalOptions {
  title: string;
  content: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  modal: ModalOptions | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const openModal = (options: ModalOptions) => setModal(options);
  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal debe usarse dentro de ModalProvider');
  return context;
}
