export interface CleanerConfig {
  stripHtml: boolean;
  stripUrls: boolean;
  stripEmojis: boolean;
  collapseDuplicates: boolean;
  compressWhitespace: boolean;
  stripUnwantedSymbols: boolean;
  stripEmails: boolean;
  stripPhoneNumbers: boolean;
  toLowerCase: boolean;
}

export interface RuleStat {
  id: string;
  name: string;
  count: number;
  description: string;
}

export interface CleaningStats {
  originalLength: number;
  cleanedLength: number;
  charactersRemoved: number;
  reductionPercentage: number;
  originalWords: number;
  cleanedWords: number;
  wordsRemoved: number;
  executionTimeMs: number;
  throughputCharsPerSec: number;
  ruleBreakdown: RuleStat[];
}

export interface CleaningResult {
  cleanedText: string;
  stats: CleaningStats;
}

export interface DFAState {
  id: string;
  label: string;
  x: number;
  y: number;
  isStart?: boolean;
  isAccept?: boolean;
  description: string;
}

export interface DFATransition {
  from: string;
  to: string;
  symbol: string;
  displaySymbol?: string;
  curve?: number; // SVG curve offset
}

export interface DFAModel {
  id: 'html' | 'space' | 'url';
  name: string;
  regularExpression: string;
  description: string;
  theoryNotes: string;
  states: DFAState[];
  alphabet: string[];
  startState: string;
  acceptStates: string[];
  transitions: DFATransition[];
  sampleInputs: { label: string; text: string; expected: 'accept' | 'reject' }[];
}

export interface SimulationStep {
  stepIndex: number;
  char: string;
  fromState: string;
  toState: string;
  transitionFound: boolean;
  isAcceptState: boolean;
  explanation: string;
}

export interface BatchFileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  rawContent: string;
  cleanedContent: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  reductionPercentage: number;
  charactersRemoved: number;
  selectedCsvColumn?: string;
  csvColumns?: string[];
}
