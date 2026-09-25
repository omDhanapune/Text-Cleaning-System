import React from 'react';
import {
  Cpu,
  Layers,
  FileSearch,
  Network,
  Database,
  BookOpen,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickPreset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickPreset,
}) => {
  const tabs = [
    {
      id: 'studio',
      label: 'Interactive Studio',
      icon: Layers,
      description: 'Dual-editor text cleaner & rule controller',
    },
    {
      id: 'inspector',
      label: 'Data & File Inspector',
      icon: FileSearch,
      description: 'Compare full uploaded context & clean output',
    },
    {
      id: 'automata',
      label: 'Automata Architecture (DFA)',
      icon: Network,
      description: 'Formal 5-tuple M=(Q,Σ,δ,q0,F) & live step simulator',
    },
    {
      id: 'batch',
      label: 'Batch Dataset Processor',
      icon: Database,
      description: 'Multi-file ingestion (.txt, .csv, .json, .html)',
    },
    {
      id: 'specs',
      label: 'Technical Specifications',
      icon: BookOpen,
      description: 'Kleene theorem, Big-O proofs & REST API',
    },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#090e1a]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Top Banner with high-tech badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-800/60">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span>LEXICLEAN</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  DFA Engine v2.4
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Intelligent Text Cleaning & Automata Preprocessor &bull; Theory of Computation
            </p>
          </div>
        </div>

        {/* TOC Mathematical Invariants Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-400">Kleene:</span>
            <span>L(Reg) ≡ L(DFA)</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-400 font-semibold">Time:</span>
            <span>O(n) Stream</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300">
            <span className="text-indigo-400 font-semibold">Space:</span>
            <span>O(1) Aux</span>
          </div>

          <button
            onClick={onQuickPreset}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition shadow-sm hover:shadow-blue-500/25 cursor-pointer ml-1"
            title="Load sample dirty review into Studio"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Preset Sample</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-1" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
