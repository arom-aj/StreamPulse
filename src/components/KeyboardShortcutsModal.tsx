import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘K / Ctrl+K', description: 'Abrir barra de búsqueda rápida y acciones' },
    { key: 'S', description: 'Sincronizar todos los canales en tiempo real' },
    { key: 'R', description: 'Marcar todas las publicaciones como leídas' },
    { key: '2 / 3 / 4', description: 'Cambiar cantidad de columnas en el Grid' },
    { key: 'Esc', description: 'Cerrar cualquier ventana flotante o modal abierto' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#101726] border border-white/[0.1] rounded-2xl shadow-2xl p-6 z-10 text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-[#00F0FF]" />
            <h3 className="font-heading font-bold text-sm tracking-tight text-white uppercase">
              Atajos de Teclado
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#0B101D] border border-white/[0.05]">
              <span className="text-slate-300">{s.description}</span>
              <kbd className="kbd-badge font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] font-mono text-slate-500 text-center">
          Navegación instantánea optimizada para teclado.
        </div>
      </div>
    </div>
  );
};
