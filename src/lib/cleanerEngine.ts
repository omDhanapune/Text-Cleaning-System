import { CleanerConfig, CleaningResult, CleaningStats, RuleStat } from '../types/cleaner';

export const DEFAULT_CLEANER_CONFIG: CleanerConfig = {
  stripHtml: true,
  stripUrls: true,
  stripEmojis: true,
  collapseDuplicates: true,
  compressWhitespace: true,
  stripUnwantedSymbols: true,
  stripEmails: false,
  stripPhoneNumbers: false,
  toLowerCase: false,
};

// Regex constants
const DIVIDER_LINE_REGEX = /^[-=_~*]{3,}$/gm;
const SCRIPT_STYLE_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
const HTML_REGEX = /<[^>]+>/g;
const HTML_ENTITIES_REGEX = /&(?:nbsp|amp|lt|gt|quot|apos|#39|#x27);/gi;
const URL_REGEX = /(?:(?:https?|ftp):\/\/|www\.)[^\s<>"'{}|\\^`]+(?<![.,!?:;)\]>])/gi;
const EMOJI_REGEX = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;
const STANDALONE_GLYPHS_REGEX = /(?:^|\s)[#@$%^&*~+=|\\/<>_{}\[\]`"]+(?=\s|$)/g;
const UNWANTED_SYMBOLS_REGEX = /[^a-zA-Z0-9\s.,!?:;\-]/g;
const DUPLICATE_PHRASES_REGEX = /\b([a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+){1,3})(?:[.,!?:;\-\s]+\1\b)+/gi;
const DUPLICATE_WORDS_REGEX = /\b([a-zA-Z0-9_-]+)(?:[.,!?:;\-\s]+\1\b)+/gi;
const WHITESPACE_REGEX = /[ \t]{2,}/g;
const MULTI_NEWLINE_REGEX = /\n{3,}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;

export function countWords(text: string): number {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function detectNoiseMetrics(text: string) {
  if (!text) {
    return {
      htmlCount: 0,
      urlCount: 0,
      emojiCount: 0,
      duplicateCount: 0,
      excessSpaceCount: 0,
      unwantedSymbolsCount: 0,
    };
  }

  const htmlMatches = text.match(HTML_REGEX) || [];
  const urlMatches = text.match(URL_REGEX) || [];
  const emojiMatches = text.match(EMOJI_REGEX) || [];
  const duplicateMatches = text.match(DUPLICATE_WORDS_REGEX) || [];
  const excessSpaceMatches = text.match(WHITESPACE_REGEX) || [];
  const unwantedSymbolsMatches = text.match(UNWANTED_SYMBOLS_REGEX) || [];

  return {
    htmlCount: htmlMatches.length,
    urlCount: urlMatches.length,
    emojiCount: emojiMatches.length,
    duplicateCount: duplicateMatches.length,
    excessSpaceCount: excessSpaceMatches.length,
    unwantedSymbolsCount: unwantedSymbolsMatches.length,
  };
}

export function cleanText(
  rawText: string,
  customConfig: Partial<CleanerConfig> = {}
): CleaningResult {
  const startTime = performance.now();
  const config: CleanerConfig = { ...DEFAULT_CLEANER_CONFIG, ...customConfig };

  if (!rawText) {
    return {
      cleanedText: '',
      stats: {
        originalLength: 0,
        cleanedLength: 0,
        charactersRemoved: 0,
        reductionPercentage: 0,
        originalWords: 0,
        cleanedWords: 0,
        wordsRemoved: 0,
        executionTimeMs: 0,
        throughputCharsPerSec: 0,
        ruleBreakdown: [],
      },
    };
  }

  let text = rawText;
  const originalLength = text.length;
  const originalWords = countWords(text);
  const ruleBreakdown: RuleStat[] = [];

  // 0. Remove separator and divider lines (e.g. "-----------------------", "=======================")
  text = text.replace(DIVIDER_LINE_REGEX, '');

  // 1. HTML Tags, Scripts & Entities
  if (config.stripHtml) {
    const scriptMatches = text.match(SCRIPT_STYLE_REGEX) || [];
    text = text.replace(SCRIPT_STYLE_REGEX, ' ');

    const matches = text.match(HTML_REGEX) || [];
    const count = scriptMatches.length + matches.length;
    if (count > 0) {
      text = text.replace(HTML_REGEX, ' ');
      text = text.replace(HTML_ENTITIES_REGEX, ' ');
    }
    ruleBreakdown.push({
      id: 'html',
      name: 'HTML/XML Stripping',
      count,
      description: 'Matches `<[^>]+>` tags, `<script>` blocks & HTML entities',
    });
  }

  // 2. URLs (cleans web addresses while preserving trailing sentence punctuation like '.')
  if (config.stripUrls) {
    const matches = text.match(URL_REGEX);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      text = text.replace(URL_REGEX, ' ');
    }
    ruleBreakdown.push({
      id: 'urls',
      name: 'Hyperlink & URL Purge',
      count,
      description: 'Matches `(?:https?|ftp)://...` and `www....` links',
    });
  }

  // 3. Optional: Emails (if disabled, protect emails so '@' inside email addresses is preserved)
  const preservedEmails: string[] = [];
  if (config.stripEmails) {
    const matches = text.match(EMAIL_REGEX);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      text = text.replace(EMAIL_REGEX, ' ');
    }
    ruleBreakdown.push({
      id: 'emails',
      name: 'Email Address Removal',
      count,
      description: 'Matches RFC 5322 email patterns',
    });
  } else {
    // Protect email addresses from being corrupted by symbol stripping
    text = text.replace(EMAIL_REGEX, (match) => {
      preservedEmails.push(match);
      return `LEXIEMAILTOKEN${preservedEmails.length - 1}END`;
    });
  }

  // 4. Optional: Phone Numbers
  if (config.stripPhoneNumbers) {
    const matches = text.match(PHONE_REGEX);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      text = text.replace(PHONE_REGEX, ' ');
    }
    ruleBreakdown.push({
      id: 'phones',
      name: 'Phone Number Removal',
      count,
      description: 'Matches international and standard telephone patterns',
    });
  }

  // 5. Emojis and Unicode Pictographs
  if (config.stripEmojis) {
    const matches = text.match(EMOJI_REGEX);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      text = text.replace(EMOJI_REGEX, '');
    }
    ruleBreakdown.push({
      id: 'emojis',
      name: 'Emoji & Unicode Purge',
      count,
      description: 'Matches high-range Unicode emoticons & symbols',
    });
  }

  // 6. Extraneous Non-Alphanumeric Symbols (preserves standard punctuation: . , ! ? : ; -)
  if (config.stripUnwantedSymbols) {
    // First: remove standalone noise glyph sequences like "### %% @@" or "$$$ ###"
    text = text.replace(STANDALONE_GLYPHS_REGEX, ' ');

    const matches = text.match(UNWANTED_SYMBOLS_REGEX);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      text = text.replace(UNWANTED_SYMBOLS_REGEX, ' ');
    }

    // Restore protected email addresses
    if (preservedEmails.length > 0) {
      text = text.replace(/LEXIEMAILTOKEN(\d+)END/g, (_, idx) => preservedEmails[Number(idx)] || '');
    }

    // Normalize repeated punctuation (even with spaces in between, e.g. "!!! !!!" or "... ...")
    text = text.replace(/(?:!\s*){2,}/g, '! ');
    text = text.replace(/(?:\?\s*){2,}/g, '? ');
    text = text.replace(/(?:\.\s*){2,}/g, '. ');
    text = text.replace(/,{2,}/g, ',');
    text = text.replace(/:{2,}/g, ':');
    text = text.replace(/;{2,}/g, ';');
    text = text.replace(/[-]{2,}/g, '-');

    // Remove orphan punctuation floating between spaces with no word (e.g. " ! ? . : ")
    text = text.replace(/(?<=\s)[.,!?:;\-](?=\s)/g, ' ');
    text = text.replace(/(?<=\s)[.,!?:;\-](?=\s)/g, ' ');

    ruleBreakdown.push({
      id: 'symbols',
      name: 'Noise Punctuation Filtering',
      count,
      description: 'Strips noise glyphs (@, #, $, %, ^, &, *) and normalizes repeated punctuation',
    });
  } else if (preservedEmails.length > 0) {
    text = text.replace(/LEXIEMAILTOKEN(\d+)END/g, (_, idx) => preservedEmails[Number(idx)] || '');
  }

  // 7. Consecutive Duplicate Phrases & Words (Case-insensitive)
  if (config.collapseDuplicates) {
    let duplicateCount = 0;

    // First pass: Collapse multi-word repeated phrases (e.g. "Wireless Headphones Wireless Headphones" or "Ticket created successfully. Ticket created successfully.")
    let prevText = '';
    while (prevText !== text) {
      prevText = text;
      text = text.replace(DUPLICATE_PHRASES_REGEX, (_match, phrase) => {
        duplicateCount++;
        return phrase;
      });
    }

    // Second pass: Collapse repeated single words (even across punctuation, e.g. "locked!!! locked!!!")
    prevText = '';
    while (prevText !== text) {
      prevText = text;
      text = text.replace(DUPLICATE_WORDS_REGEX, (_match, word) => {
        duplicateCount++;
        return word;
      });
    }

    ruleBreakdown.push({
      id: 'duplicates',
      name: 'Consecutive Token Deduplication',
      count: duplicateCount,
      description: 'Collapses redundant sequences (e.g. "check check" → "check", "the the" → "the")',
    });
  }

  // 8. Whitespace and Tab Compression
  if (config.compressWhitespace) {
    const spaceMatches = text.match(WHITESPACE_REGEX) || [];
    const newlineMatches = text.match(MULTI_NEWLINE_REGEX) || [];
    const count = spaceMatches.length + newlineMatches.length;

    // Clean whitespace right before punctuation (e.g. "word ." -> "word.")
    text = text.replace(/\s+([.,!?:;])/g, '$1');
    // Ensure space after punctuation if immediately followed by a letter (protects time like "02:00" and numbers like "1,250.00")
    text = text.replace(/([.,!?:;])(?=[a-zA-Z])/g, '$1 ');
    text = text.replace(WHITESPACE_REGEX, ' ');
    text = text.replace(MULTI_NEWLINE_REGEX, '\n\n');
    text = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line, idx, arr) => line.length > 0 || (idx > 0 && arr[idx - 1].length > 0))
      .join('\n')
      .trim();

    ruleBreakdown.push({
      id: 'whitespace',
      name: 'Whitespace Compression',
      count,
      description: 'Compresses `[ \\t]{2,}` and excessive newlines into single spaces',
    });
  }

  // 9. Optional: Lowercase
  if (config.toLowerCase) {
    text = text.toLowerCase();
    ruleBreakdown.push({
      id: 'case',
      name: 'Case Normalization',
      count: 1,
      description: 'Converts entire string to lowercase for NLP embeddings',
    });
  }

  const endTime = performance.now();
  const executionTimeMs = Math.max(0.01, Number((endTime - startTime).toFixed(2)));
  const cleanedLength = text.length;
  const charactersRemoved = Math.max(0, originalLength - cleanedLength);
  const reductionPercentage =
    originalLength > 0
      ? Number(((charactersRemoved / originalLength) * 100).toFixed(1))
      : 0;

  const cleanedWords = countWords(text);
  const wordsRemoved = Math.max(0, originalWords - cleanedWords);
  const throughputCharsPerSec =
    executionTimeMs > 0
      ? Math.round((originalLength / (executionTimeMs / 1000)))
      : originalLength * 1000;

  const stats: CleaningStats = {
    originalLength,
    cleanedLength,
    charactersRemoved,
    reductionPercentage,
    originalWords,
    cleanedWords,
    wordsRemoved,
    executionTimeMs,
    throughputCharsPerSec,
    ruleBreakdown,
  };

  return {
    cleanedText: text,
    stats,
  };
}

export function cleanCsvText(
  csvContent: string,
  targetColumnName: string,
  config: Partial<CleanerConfig> = {}
): { cleanedCsv: string; processedRows: number; stats: CleaningStats } {
  const lines = csvContent.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length < 2) {
    const res = cleanText(csvContent, config);
    return { cleanedCsv: res.cleanedText, processedRows: 0, stats: res.stats };
  }

  // Basic CSV parser for headers
  const headerLine = lines[0];
  const headers = headerLine.split(',').map((h) => h.replace(/^["']|["']$/g, '').trim());
  let targetColIndex = headers.indexOf(targetColumnName);
  if (targetColIndex === -1) {
    // try case-insensitive or common names
    targetColIndex = headers.findIndex(
      (h) => h.toLowerCase() === targetColumnName.toLowerCase() ||
             h.toLowerCase().includes('text') ||
             h.toLowerCase().includes('review') ||
             h.toLowerCase().includes('comment')
    );
  }

  if (targetColIndex === -1) {
    targetColIndex = headers.length - 1; // fallback to last column
  }

  const outHeaders = [...headers, `cleaned_${headers[targetColIndex] || 'text'}`];
  const outLines: string[] = [outHeaders.map((h) => `"${h}"`).join(',')];

  let totalOriginalLength = 0;
  let totalCleanedLength = 0;
  let rowCount = 0;
  const startTime = performance.now();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple comma split respecting quotes
    const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) =>
      c.replace(/^["']|["']$/g, '').trim()
    );
    const cellValue = cells[targetColIndex] || '';
    totalOriginalLength += cellValue.length;

    const cleaned = cleanText(cellValue, config);
    totalCleanedLength += cleaned.cleanedText.length;

    cells.push(cleaned.cleanedText.replace(/"/g, '""'));
    outLines.push(cells.map((c) => `"${c}"`).join(','));
    rowCount++;
  }

  const endTime = performance.now();
  const execTime = Math.max(0.05, Number((endTime - startTime).toFixed(2)));
  const charsRemoved = Math.max(0, totalOriginalLength - totalCleanedLength);
  const reductionPercentage =
    totalOriginalLength > 0
      ? Number(((charsRemoved / totalOriginalLength) * 100).toFixed(1))
      : 0;

  return {
    cleanedCsv: outLines.join('\n'),
    processedRows: rowCount,
    stats: {
      originalLength: totalOriginalLength,
      cleanedLength: totalCleanedLength,
      charactersRemoved: charsRemoved,
      reductionPercentage,
      originalWords: Math.round(totalOriginalLength / 5),
      cleanedWords: Math.round(totalCleanedLength / 5),
      wordsRemoved: Math.round(charsRemoved / 5),
      executionTimeMs: execTime,
      throughputCharsPerSec: Math.round(totalOriginalLength / (execTime / 1000)),
      ruleBreakdown: [
        {
          id: 'csv_batch',
          name: `Batch Processed ${rowCount} CSV rows`,
          count: rowCount,
          description: `Sanitized target column "${headers[targetColIndex]}"`,
        },
      ],
    },
  };
}
