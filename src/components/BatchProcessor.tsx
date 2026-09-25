import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  Trash2,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { BatchFileItem, CleanerConfig } from '../types/cleaner';
import { cleanText, cleanCsvText } from '../lib/cleanerEngine';
import { SAMPLE_TEXTS, SAMPLE_CSV_DATA } from '../lib/sampleData';

interface BatchProcessorProps {
  config: CleanerConfig;
  onSendToInspector: (filename: string, content: string) => void;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({
  config,
  onSendToInspector,
}) => {
  const [files, setFiles] = useState<BatchFileItem[]>([
    {
      id: 'sample-csv-1',
      name: 'sample_nlp_dataset.csv',
      size: SAMPLE_CSV_DATA.length,
      type: 'csv',
      rawContent: SAMPLE_CSV_DATA,
      cleanedContent: '',
      status: 'pending',
      reductionPercentage: 0,
      charactersRemoved: 0,
    },
    {
      id: 'sample-txt-2',
      name: 'sample_dirty_data.txt',
      size: SAMPLE_TEXTS.dirtyCustomerReview.length,
      type: 'txt',
      rawContent: SAMPLE_TEXTS.dirtyCustomerReview,
      cleanedContent: '',
      status: 'pending',
      reductionPercentage: 0,
      charactersRemoved: 0,
    },
  ]);

  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newItem: BatchFileItem = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: extension,
          rawContent: content,
          cleanedContent: '',
          status: 'pending',
          reductionPercentage: 0,
          charactersRemoved: 0,
        };
        setFiles((prev) => [...prev, newItem]);
      };
      reader.readAsText(file);
    });
  };

  const handleProcessFile = (item: BatchFileItem) => {
    let cleaned = '';
    let charsRemoved = 0;
    let reduction = 0;

    if (item.type === 'csv' || item.name.endsWith('.csv')) {
      const res = cleanCsvText(item.rawContent, 'raw_text', config);
      cleaned = res.cleanedCsv;
      charsRemoved = res.stats.charactersRemoved;
      reduction = res.stats.reductionPercentage;
    } else {
      const res = cleanText(item.rawContent, config);
      cleaned = res.cleanedText;
      charsRemoved = res.stats.charactersRemoved;
      reduction = res.stats.reductionPercentage;
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.id === item.id
          ? {
              ...f,
              cleanedContent: cleaned,
              status: 'done',
              charactersRemoved: charsRemoved,
              reductionPercentage: reduction,
            }
          : f
      )
    );
  };

  const handleProcessAll = () => {
    setIsProcessingAll(true);
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((item) => {
          let cleaned = '';
          let charsRemoved = 0;
          let reduction = 0;

          if (item.type === 'csv' || item.name.endsWith('.csv')) {
            const res = cleanCsvText(item.rawContent, 'raw_text', config);
            cleaned = res.cleanedCsv;
            charsRemoved = res.stats.charactersRemoved;
            reduction = res.stats.reductionPercentage;
          } else {
            const res = cleanText(item.rawContent, config);
            cleaned = res.cleanedText;
            charsRemoved = res.stats.charactersRemoved;
            reduction = res.stats.reductionPercentage;
          }

          return {
            ...item,
            cleanedContent: cleaned,
            status: 'done',
            charactersRemoved: charsRemoved,
            reductionPercentage: reduction,
          };
        })
      );
      setIsProcessingAll(false);
    }, 300);
  };

  const handleDownloadCleaned = (item: BatchFileItem) => {
    if (!item.cleanedContent) return;
    const blob = new Blob([item.cleanedContent], {
      type: item.type === 'csv' ? 'text/csv;charset=utf-8' : 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${item.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Batch Dataset Ingestion & Preprocessor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Drop multiple `.txt`, `.csv`, `.json`, and `.html` files for high-throughput parallel
            normalization.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv,.json,.html,.log"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Add Files</span>
          </button>

          <button
            onClick={handleProcessAll}
            disabled={files.length === 0 || isProcessingAll}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-40"
          >
            {isProcessingAll ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Process All Files ({files.length})</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = e.dataTransfer.files;
          if (!dropped) return;
          Array.from(dropped).forEach((file) => {
            const extension = file.name.split('.').pop()?.toLowerCase() || 'txt';
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result as string;
              const newItem: BatchFileItem = {
                id: `file-${Date.now()}-${Math.random()}`,
                name: file.name,
                size: file.size,
                type: extension,
                rawContent: content,
                cleanedContent: '',
                status: 'pending',
                reductionPercentage: 0,
                charactersRemoved: 0,
              };
              setFiles((prev) => [...prev, newItem]);
            };
            reader.readAsText(file);
          });
        }}
        className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 rounded-xl p-6 text-center bg-[#090f1d]/60 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-200">
          Drag and drop datasets here, or browse files
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Supported: Plain Text (.txt), CSV Reviews (.csv), JSON Payloads (.json), Web Scrapes (.html)
        </p>
      </div>

      {/* Files Queue Table */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#11192e] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Dataset Ingestion Queue ({files.length})
          </span>
          <button
            onClick={() => setFiles([])}
            className="text-xs text-slate-400 hover:text-red-400 transition cursor-pointer"
          >
            Clear All
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#111a2f]/50 transition"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                  {file.type === 'csv' ? (
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  ) : file.type === 'html' ? (
                    <FileCode className="w-5 h-5 text-amber-400" />
                  ) : (
                    <FileText className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200 font-mono">{file.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                    <span>&bull;</span>
                    <span className="uppercase">{file.type}</span>
                    {file.status === 'done' && (
                      <>
                        <span>&bull;</span>
                        <span className="text-emerald-400 font-semibold">
                          -{file.reductionPercentage}% noise stripped
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center space-x-2">
                {file.status === 'done' ? (
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Processed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleProcessFile(file)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Clean</span>
                  </button>
                )}

                {/* Send to Inspector */}
                <button
                  onClick={() => onSendToInspector(file.name, file.rawContent)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
                  title="Open in Data & File Inspector"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                {/* Download */}
                <button
                  onClick={() => handleDownloadCleaned(file)}
                  disabled={file.status !== 'done'}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition cursor-pointer"
                  title="Download Cleaned File"
                >
                  <Download className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition cursor-pointer"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
