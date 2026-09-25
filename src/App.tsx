import React, { useState } from 'react';
import { Header } from './components/Header';
import { InteractiveStudio } from './components/InteractiveStudio';
import { DataFileInspector } from './components/DataFileInspector';
import { AutomataStudio } from './components/AutomataStudio';
import { BatchProcessor } from './components/BatchProcessor';
import { TechnicalSpecs } from './components/TechnicalSpecs';
import { CleanerConfig } from './types/cleaner';
import { DEFAULT_CLEANER_CONFIG } from './lib/cleanerEngine';
import { SAMPLE_TEXTS } from './lib/sampleData';
import { Cpu, Terminal, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [config, setConfig] = useState<CleanerConfig>(DEFAULT_CLEANER_CONFIG);

  // Studio text state
  const [studioRawText, setStudioRawText] = useState<string>(
    SAMPLE_TEXTS.dirtyCustomerReview
  );

  // Inspector file text state
  const [inspectorFileName, setInspectorFileName] = useState<string>(
    'sample_dirty_data.txt'
  );
  const [inspectorRawText, setInspectorRawText] = useState<string>(
    SAMPLE_TEXTS.fullBenchmarkCorpus
  );

  const handleQuickPreset = () => {
    setStudioRawText(SAMPLE_TEXTS.socialMediaPost);
    setActiveTab('studio');
  };

  const handleSendToInspector = (filename: string, content: string) => {
    setInspectorFileName(filename);
    setInspectorRawText(content);
    setActiveTab('inspector');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Enterprise Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickPreset={handleQuickPreset}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
          <InteractiveStudio
            rawText={studioRawText}
            setRawText={setStudioRawText}
            config={config}
            setConfig={setConfig}
          />
        )}

        {activeTab === 'inspector' && (
          <DataFileInspector
            config={config}
            setConfig={setConfig}
            rawFileText={inspectorRawText}
            setRawFileText={setInspectorRawText}
            fileName={inspectorFileName}
            setFileName={setInspectorFileName}
          />
        )}

        {activeTab === 'automata' && <AutomataStudio />}

        {activeTab === 'batch' && (
          <BatchProcessor
            config={config}
            onSendToInspector={handleSendToInspector}
          />
        )}

        {activeTab === 'specs' && <TechnicalSpecs />}
      </main>

      {/* Enterprise Dark Theme Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090e1a] text-slate-400 text-xs py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">LEXICLEAN ENGINE</span>
            <span>&bull;</span>
            <span>Theory of Computation (TOC) Text Preprocessor</span>
          </div>

          <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>O(n) Linear Streaming</span>
            </span>
            <span>&bull;</span>
            <span>Kleene: L(Regex) ≡ L(DFA)</span>
            <span>&bull;</span>
            <span className="text-slate-400">Production Build v2.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
