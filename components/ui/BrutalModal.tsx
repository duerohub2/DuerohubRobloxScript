'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface BrutalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BrutalModal({ isOpen, onClose, title, children }: BrutalModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white border-[4px] border-dark shadow-brutal-xl p-8 rounded-none relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 bg-white border-[3px] border-dark shadow-brutal-sm p-1 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100 rounded-none"
        >
          <X size={18} strokeWidth={3} />
        </button>
        {title && <h2 className="font-display uppercase text-2xl mb-6 pr-10">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
