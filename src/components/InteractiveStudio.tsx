import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Trash2,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Code,
  Link,
  Smile,
  CopyCheck,
  Space,
  Hash,
  Clock,
  Gauge,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CleanerConfig } from '../types/cleaner';
import {
  cleanText,
  countWords,
  detectNoiseMetrics,
  DEFAULT_CLEANER_CONFIG,
} from '../lib/cleanerEngine';
import { SAMPLE_TEXTS } from '../lib/sampleData';

interface InteractiveStudioProps {
  rawText: string;
  setRawText: (text: string) => void;
  config: CleanerConfig;
  setConfig: React.Dispatch<React.SetStateAction<CleanerConfig>>;
}

export const InteractiveStudio: React.FC<InteractiveStudioProps> = ({
  rawText,
  setRawText,
  config,
  setConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(true);

  // Compute cleaned text and stats
  const result = useMemo(() => {
    return cleanText(rawText, config);
  }, [rawText, config]);

  const noise = useMemo(() => {
    return detectNoiseMetrics(rawText);
  }, [rawText]);

  const handleCopy = () => {
    if (!result.cleanedText) return;
    navigator.clipboard.writeText(result.cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result.cleanedText) return;
    const blob = new Blob([result.cleanedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexiclean_output_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleRule = (key: keyof CleanerConfig) => {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectPreset = (key: keyof typeof SAMPLE_TEXTS) => {
    setRawText(SAMPLE_TEXTS[key]);
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Raw Volume
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {result.stats.originalLength.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">chars</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {result.stats.originalWords.toLocaleString()} words
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Clean Volume
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {result.stats.cleanedLength.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">chars</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {result.stats.cleanedWords.toLocaleString()} words
          </div>
        </div>

        <div className="bg-[#101726] border border-blue-900/40 rounded-xl p-3.5 shadow-sm bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">
            Noise Reduced
          </div>
          <div className="text-xl font-bold text-blue-400 mt-1">
            {result.stats.reductionPercentage}%
          </div>
          <div className="text-[11px] text-blue-300/80 mt-0.5">
            -{result.stats.charactersRemoved.toLocaleString()} chars
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Duplicates Purged
          </div>
          <div className="text-xl font-bold text-indigo-400 mt-1">
            {result.stats.ruleBreakdown.find((r) => r.id === 'duplicates')?.count || 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">consecutive tokens</div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Execution</span>
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {result.stats.executionTimeMs}
            <span className="text-xs font-normal text-slate-500 ml-1">ms</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>O(n) Stream</span>
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5 shadow-sm">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Throughput</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {result.stats.throughputCharsPerSec > 1000000
              ? `${(result.stats.throughputCharsPerSec / 1000000).toFixed(1)}M`
              : `${Math.round(result.stats.throughputCharsPerSec / 1000)}k`}
            <span className="text-xs font-normal text-slate-500 ml-1">c/s</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Zero ReDoS risk</div>
        </div>
      </div>

      {/* Rules Toggle Bar */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Automata & Regex Normalization Rules
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                setConfig({
                  stripHtml: true,
                  stripUrls: true,
                  stripEmojis: true,
                  collapseDuplicates: true,
                  compressWhitespace: true,
                  stripUnwantedSymbols: true,
                  stripEmails: false,
                  stripPhoneNumbers: false,
                  toLowerCase: false,
                })
              }
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition cursor-pointer"
            >
              Reset Defaults
            </button>
            <button
              onClick={() =>
                setConfig({
                  stripHtml: true,
                  stripUrls: true,
                  stripEmojis: true,
                  collapseDuplicates: true,
                  compressWhitespace: true,
                  stripUnwantedSymbols: true,
                  stripEmails: true,
                  stripPhoneNumbers: true,
                  toLowerCase: true,
                })
              }
              className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition cursor-pointer"
            >
              Enable All
            </button>
          </div>
        </div>

        {/* Individual Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 pt-3">
          <button
            onClick={() => handleToggleRule('stripHtml')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.stripHtml
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Code className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">HTML / XML</span>
          </button>

          <button
            onClick={() => handleToggleRule('stripUrls')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.stripUrls
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Link className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">URLs & Links</span>
          </button>

          <button
            onClick={() => handleToggleRule('stripEmojis')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.stripEmojis
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Smile className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Emojis & Pictos</span>
          </button>

          <button
            onClick={() => handleToggleRule('collapseDuplicates')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.collapseDuplicates
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <CopyCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Duplicates</span>
          </button>

          <button
            onClick={() => handleToggleRule('compressWhitespace')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.compressWhitespace
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Space className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Spaces & Tabs</span>
          </button>

          <button
            onClick={() => handleToggleRule('stripUnwantedSymbols')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.stripUnwantedSymbols
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Hash className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Noise Symbols</span>
          </button>

          <button
            onClick={() => handleToggleRule('toLowerCase')}
            className={`flex items-center space-x-2 p-2 rounded-lg text-xs font-medium border transition cursor-pointer ${
              config.toLowerCase
                ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="font-mono text-xs font-bold">aA</span>
            <span className="truncate">Lowercasing</span>
          </button>
        </div>
      </div>

      {/* Main Dual Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Raw Text Input */}
        <div className="flex flex-col bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Box Header */}
          <div className="bg-[#11192e] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Raw Input Stream
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                ({rawText.length.toLocaleString()} chars &bull; {countWords(rawText)} words)
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <div className="relative inline-block">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleSelectPreset(e.target.value as keyof typeof SAMPLE_TEXTS);
                    }
                  }}
                  defaultValue=""
                  className="text-xs bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 rounded-md px-2.5 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    ⚡ Presets...
                  </option>
                  <option value="dirtyCustomerReview">Customer Review (Tags, URLs, Dups)</option>
                  <option value="socialMediaPost">Social Tweet (Emojis, URLs, Spaces)</option>
                  <option value="htmlScrape">HTML Web Scraping Payload</option>
                  <option value="duplicateTokens">Extreme Token Duplications</option>
                  <option value="fullBenchmarkCorpus">Benchmark Corpus (Multi-record)</option>
                </select>
              </div>

              <button
                onClick={() => setRawText('')}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-800 transition cursor-pointer"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Detected Noise Indicators Banner */}
          <div className="bg-[#090e1b] px-4 py-1.5 border-b border-slate-800/60 flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-500 font-sans">Noise Signals:</span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.htmlCount > 0 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'text-slate-600'
              }`}
            >
              HTML: {noise.htmlCount}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.urlCount > 0 ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30' : 'text-slate-600'
              }`}
            >
              URLs: {noise.urlCount}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.emojiCount > 0 ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30' : 'text-slate-600'
              }`}
            >
              Emojis: {noise.emojiCount}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.duplicateCount > 0 ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30' : 'text-slate-600'
              }`}
            >
              Dups: {noise.duplicateCount}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.excessSpaceCount > 0 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-600'
              }`}
            >
              Spaces: {noise.excessSpaceCount}
            </span>
          </div>

          {/* Text Area */}
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Type or paste messy raw text, HTML content, URLs, emojis, duplicate words..."
            rows={14}
            className="w-full bg-[#0a0f1d] text-slate-200 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-y selection:bg-blue-600 selection:text-white leading-relaxed"
          />
        </div>

        {/* Right: Clean Normalized Output */}
        <div className="flex flex-col bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Box Header */}
          <div className="bg-[#11192e] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Normalized Clean Text
              </h2>
              <span className="text-[11px] text-emerald-400 font-mono">
                ({result.stats.cleanedLength.toLocaleString()} chars &bull;{' '}
                {result.stats.cleanedWords.toLocaleString()} words)
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopy}
                disabled={!result.cleanedText}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer disabled:opacity-40"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                disabled={!result.cleanedText}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600/90 hover:bg-blue-600 text-white transition cursor-pointer disabled:opacity-40 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Reduction info bar */}
          <div className="bg-[#090e1b] px-4 py-1.5 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">
              Noise Reduction:{' '}
              <strong className="text-emerald-400">{result.stats.reductionPercentage}%</strong>
            </span>
            <span className="text-slate-500">
              Purged: {result.stats.charactersRemoved.toLocaleString()} chars
            </span>
          </div>

          {/* Clean Output Area */}
          <div className="w-full bg-[#080d1a] text-slate-100 font-mono text-xs sm:text-sm p-4 overflow-y-auto min-h-[330px] max-h-[500px] leading-relaxed whitespace-pre-wrap selection:bg-emerald-600 selection:text-white">
            {result.cleanedText ? (
              result.cleanedText
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-16 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Normalized text will render here automatically in linear O(n) time.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Audit Log & Transformation Step Breakdown */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-4 shadow-sm">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>Automata Transformation Pipeline Audit Trail</span>
          <span className="text-[11px] font-normal text-slate-500 font-mono">
            (Sequential O(n) passes)
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.stats.ruleBreakdown.map((rule) => (
            <div
              key={rule.id}
              className="bg-[#121a2d] border border-slate-800/80 rounded-lg p-3 flex items-start justify-between gap-3"
            >
              <div>
                <div className="text-xs font-medium text-slate-200">{rule.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{rule.description}</div>
              </div>
              <div
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  rule.count > 0
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {rule.count} hit{rule.count === 1 ? '' : 's'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
