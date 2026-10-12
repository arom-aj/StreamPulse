import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  FolderTree, 
  Database, 
  Cpu, 
  Radio, 
  Layers, 
  Smartphone, 
  Play, 
  Sparkles,
  Terminal
} from 'lucide-react';
import { LARAVEL_CODE_SNIPPETS, CodeSnippetItem } from '../data/laravelCodeSnippets';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSimulationPulse: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  onTriggerSimulationPulse,
}) => {
  const [activeSnippetId, setActiveSnippetId] = useState<string>(LARAVEL_CODE_SNIPPETS[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = LARAVEL_CODE_SNIPPETS.find(s => s.id === activeSnippetId) || LARAVEL_CODE_SNIPPETS[0];

  const handleCopy = async (code: string, id: string) => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationLog([
      '[HORIZON] Despachando FetchSingleSourceJob para fuente: "Laravel Daily (YouTube)"...',
    ]);

    setTimeout(() => {
      setSimulationLog(prev => [
        ...prev,
        '[ADAPTER] YouTubeAdapter::fetch() -> Consultando YouTube Data API v3 (Quota: +100)...',
        '[READABILITY] Limpiando descripción y metadata HTML...'
      ]);
    }, 600);

    setTimeout(() => {
      setSimulationLog(prev => [
        ...prev,
        '[DTO] Generado NormalizedFeedItemDTO (ID: dQw4w9WgXcQ, Type: youtube_video)',
        '[DATABASE] Inserción atómica en feed_items con índice compuesto (source_id, published_at)...'
      ]);
    }, 1200);

    setTimeout(() => {
      setSimulationLog(prev => [
        ...prev,
        '[REVERB] BroadcastEvent emitido a canal privado "streampulse-live" vía WebSockets!',
        '[SUCCESS] Ingestión completada en 18ms. UI actualizada sin recargar la página.'
      ]);
      setIsSimulating(false);
      onTriggerSimulationPulse();
    }, 1900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      {/* Background click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Architecture Container */}
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-[#090d18] border border-cyan-800/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#050811] border-b border-cyan-950 text-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-900/50 border border-purple-600 text-purple-300">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-100 font-display">
                  ARQUITECTURA DE PRODUCCIÓN LARAVEL 11 & PHP 8.3
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-semibold">
                  STREAMPULSE CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Arquitectura Hexagonal, Pipelines Asíncronos con Redis, Reverb WebSockets y Livewire 3
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body: Sidebar tabs + Code viewer */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Navigation Tabs */}
          <div className="w-full lg:w-72 bg-[#060a14] border-r border-cyan-950/70 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-bold px-2 block mb-2">
              Entregables del Sistema
            </span>

            {LARAVEL_CODE_SNIPPETS.map((snippet) => {
              const isSelected = snippet.id === activeSnippetId;
              const icons = {
                architecture: <FolderTree className="w-3.5 h-3.5 text-cyan-400" />,
                migrations: <Database className="w-3.5 h-3.5 text-amber-400" />,
                adapters: <Cpu className="w-3.5 h-3.5 text-purple-400" />,
                jobs: <Radio className="w-3.5 h-3.5 text-emerald-400" />,
                livewire: <Layers className="w-3.5 h-3.5 text-blue-400" />,
                pwa: <Smartphone className="w-3.5 h-3.5 text-pink-400" />,
              };

              return (
                <button
                  key={snippet.id}
                  onClick={() => setActiveSnippetId(snippet.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-950/60 border border-cyan-700/80 text-cyan-200 font-semibold shadow-inner'
                      : 'hover:bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {icons[snippet.category]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-slate-200">{snippet.title}</p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{snippet.filename}</p>
                  </div>
                </button>
              );
            })}

            {/* Ingestion Simulator Box */}
            <div className="mt-4 pt-3 border-t border-cyan-950/70">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold px-2 block mb-1">
                Sandbox de Ingestión
              </span>
              <p className="text-[11px] text-slate-400 px-2 mb-2 leading-relaxed">
                Prueba la ejecución en tiempo real del pipeline de adaptador y broadcast.
              </p>
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/60 text-cyan-300 text-xs font-mono font-semibold transition"
              >
                <Play className={`w-3 h-3 ${isSimulating ? 'animate-spin' : 'fill-current'}`} />
                <span>{isSimulating ? 'Ejecutando Job...' : 'Simular Ingestión Job'}</span>
              </button>

              {simulationLog.length > 0 && (
                <div className="mt-2 p-2 bg-black/70 border border-cyan-950 rounded-lg text-[10px] font-mono text-slate-300 space-y-1 max-h-36 overflow-y-auto">
                  {simulationLog.map((log, index) => (
                    <div key={index} className="text-cyan-300/90 leading-tight">
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Code Display Area */}
          <div className="flex-1 flex flex-col bg-[#070b14] overflow-hidden">
            {/* Snippet Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#050810] border-b border-cyan-950 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">{currentSnippet.filename}</span>
                <span className="text-slate-500">({currentSnippet.language})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(currentSnippet.code, currentSnippet.id)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition text-xs"
                  title="Copiar código al portapapeles"
                >
                  {copiedId === currentSnippet.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="px-4 py-2 bg-[#0c1220] border-b border-cyan-950/60 text-xs text-slate-400 font-mono">
              💡 {currentSnippet.description}
            </div>

            {/* Code Body with scroll */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-[#060a12]">
              <pre className="whitespace-pre overflow-x-auto selection:bg-cyan-600/40">
                <code>{currentSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
