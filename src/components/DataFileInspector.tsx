import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Play,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Layers,
} from 'lucide-react';
import { CleanerConfig, CleaningResult } from '../types/cleaner';
import {
  cleanText,
  cleanCsvText,
  countWords,
  detectNoiseMetrics,
} from '../lib/cleanerEngine';
import { SAMPLE_TEXTS, SAMPLE_CSV_DATA } from '../lib/sampleData';

interface DataFileInspectorProps {
  config: CleanerConfig;
  setConfig: React.Dispatch<React.SetStateAction<CleanerConfig>>;
  rawFileText: string;
  setRawFileText: (text: string) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

export const DataFileInspector: React.FC<DataFileInspectorProps> = ({
  config,
  setConfig,
  rawFileText,
  setRawFileText,
  fileName,
  setFileName,
}) => {
  const [cleanedOutput, setCleanedOutput] = useState<string>('');
  const [cleaningResult, setCleaningResult] = useState<CleaningResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [fileType, setFileType] = useState<string>('txt');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Noise breakdown for raw text
  const noise = detectNoiseMetrics(rawFileText);
  const rawWords = countWords(rawFileText);
  const cleanWords = countWords(cleanedOutput);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
    setFileType(extension);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawFileText(content || '');
      setCleanedOutput('');
      setCleaningResult(null);
    };
    reader.readAsText(file);
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
    setFileType(extension);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawFileText(content || '');
      setCleanedOutput('');
      setCleaningResult(null);
    };
    reader.readAsText(file);
  };

  // Dedicated Clean / Process Button Action
  const handleProcessData = () => {
    if (!rawFileText.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      if (fileType === 'csv' || fileName.endsWith('.csv')) {
        const res = cleanCsvText(rawFileText, 'raw_text', config);
        setCleanedOutput(res.cleanedCsv);
        setCleaningResult({
          cleanedText: res.cleanedCsv,
          stats: res.stats,
        });
      } else {
        const res = cleanText(rawFileText, config);
        setCleanedOutput(res.cleanedText);
        setCleaningResult(res);
      }
      setIsProcessing(false);
    }, 150);
  };

  const handleCopy = () => {
    if (!cleanedOutput) return;
    navigator.clipboard.writeText(cleanedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCleaned = () => {
    if (!cleanedOutput) return;
    const blob = new Blob([cleanedOutput], {
      type: fileType === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${fileName || 'dataset.txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSampleDataset = () => {
    setFileName('sample_nlp_corpus_100_records.txt');
    setFileType('txt');
    setRawFileText(SAMPLE_TEXTS.fullBenchmarkCorpus);
    setCleanedOutput('');
    setCleaningResult(null);
  };

  const handleLoadSampleCsv = () => {
    setFileName('sample_nlp_dataset.csv');
    setFileType('csv');
    setRawFileText(SAMPLE_CSV_DATA);
    setCleanedOutput('');
    setCleaningResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Top File Inspector Banner & Quick Actions */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Data & File Inspector</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
              Full Document Verification
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload any text, CSV, JSON, or HTML file. Inspect the complete raw context in Box 1, click
            Clean to process, and view the normalized output in Box 2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv,.json,.html,.log,.md"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload File</span>
          </button>

          <button
            onClick={handleLoadSampleDataset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Load 100-Record Corpus</span>
          </button>

          <button
            onClick={handleLoadSampleCsv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Sample CSV</span>
          </button>
        </div>
      </div>

      {/* Top KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Raw Volume (Box 1)
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {rawFileText.length.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">chars</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{rawWords.toLocaleString()} words</div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Normalized Volume (Box 2)
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {cleanedOutput ? cleanedOutput.length.toLocaleString() : '0'}
            <span className="text-xs font-normal text-slate-500 ml-1">chars</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {cleanWords.toLocaleString()} words
          </div>
        </div>

        <div className="bg-[#101726] border border-blue-900/40 rounded-xl p-3.5 bg-gradient-to-b from-blue-950/20 to-transparent">
          <div className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">
            Noise Eliminated
          </div>
          <div className="text-xl font-bold text-blue-400 mt-1">
            {cleaningResult ? `${cleaningResult.stats.reductionPercentage}%` : '0%'}
          </div>
          <div className="text-[11px] text-blue-300/80 mt-0.5">
            {cleaningResult
              ? `-${cleaningResult.stats.charactersRemoved.toLocaleString()} chars`
              : 'Awaiting process'}
          </div>
        </div>

        <div className="bg-[#101726] border border-slate-800/80 rounded-xl p-3.5">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Execution Latency
          </div>
          <div className="text-xl font-bold text-indigo-400 mt-1">
            {cleaningResult ? `${cleaningResult.stats.executionTimeMs} ms` : '0.00 ms'}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Linear Streaming O(n)</div>
        </div>
      </div>

      {/* Central Action Bar: The Requested Clean/Process Button */}
      <div className="bg-[#0e1628] border border-blue-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md shadow-blue-900/10">
        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              Active File: <span className="font-mono text-blue-300">{fileName}</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Ready to execute regex & DFA text normalization passes
            </div>
          </div>
        </div>

        {/* PROMINENT PROCESS BUTTON */}
        <button
          onClick={handleProcessData}
          disabled={!rawFileText.trim() || isProcessing}
          className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Normalizing Stream...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>⚡ Clean & Normalize Dataset</span>
            </>
          )}
        </button>
      </div>

      {/* Side-by-Side Dual Boxes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Box 1 (Left): Full Raw Uploaded Data/Context */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow-lg"
        >
          {/* Box 1 Header */}
          <div className="bg-[#11192e] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Box 1: Full Raw Context
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">({fileName})</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400 font-mono">
                {rawFileText.length.toLocaleString()} chars
              </span>
              <button
                onClick={() => {
                  setRawFileText('');
                  setCleanedOutput('');
                  setCleaningResult(null);
                }}
                className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-800"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Detected Noise Indicators */}
          <div className="bg-[#090e1b] px-4 py-2 border-b border-slate-800/60 flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-400 font-sans">Detected Noise:</span>
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
              Duplicates: {noise.duplicateCount}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                noise.excessSpaceCount > 0 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-600'
              }`}
            >
              Spaces: {noise.excessSpaceCount}
            </span>
          </div>

          {/* Raw Full Text Content Viewer */}
          <textarea
            value={rawFileText}
            onChange={(e) => setRawFileText(e.target.value)}
            placeholder="Drag & drop a file here or click 'Upload File' / 'Load Sample Corpus' above to view the full raw context..."
            rows={18}
            className="w-full bg-[#0a0f1d] text-slate-300 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-y leading-relaxed"
          />
        </div>

        {/* Box 2 (Right): Normalized Clean Text */}
        <div className="flex flex-col bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          {/* Box 2 Header */}
          <div className="bg-[#11192e] px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Box 2: Normalized Clean Output
              </h3>
              {cleanedOutput && (
                <span className="text-[11px] text-emerald-400 font-mono">
                  ({cleanedOutput.length.toLocaleString()} chars)
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                disabled={!cleanedOutput}
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
                onClick={handleDownloadCleaned}
                disabled={!cleanedOutput}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer disabled:opacity-40 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Clean Output Metric summary */}
          <div className="bg-[#090e1b] px-4 py-2 border-b border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
            {cleaningResult ? (
              <>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Successfully Normalized ({cleaningResult.stats.reductionPercentage}% Noise Stripped)
                  </span>
                </span>
                <span className="text-slate-400 font-sans">
                  {cleanWords.toLocaleString()} Clean Words
                </span>
              </>
            ) : (
              <span className="text-slate-500 flex items-center gap-1.5 font-sans">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Click "⚡ Clean & Normalize Dataset" to populate Box 2</span>
              </span>
            )}
          </div>

          {/* Clean Text Content Viewer */}
          <div className="w-full bg-[#080d1a] text-slate-100 font-mono text-xs sm:text-sm p-4 overflow-y-auto min-h-[380px] max-h-[500px] leading-relaxed whitespace-pre-wrap selection:bg-emerald-600 selection:text-white">
            {cleanedOutput ? (
              cleanedOutput
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20 space-y-3">
                <Play className="w-10 h-10 text-slate-600" />
                <p className="text-xs text-slate-400 max-w-sm text-center">
                  Full context is loaded in Box 1 on the left. Click the{' '}
                  <strong className="text-blue-400">⚡ Clean & Normalize Dataset</strong> button above to
                  generate the normalized stream in Box 2.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
