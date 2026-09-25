import { DFAModel, SimulationStep } from '../types/cleaner';

export const DFA_MODELS: Record<string, DFAModel> = {
  html: {
    id: 'html',
    name: 'HTML/XML Tag Recognizer DFA',
    regularExpression: '<[^>]+>',
    description: 'Deterministic recognizer for opening, closing, and self-closing markup tags in linear O(n) streaming time.',
    theoryNotes:
      'Recognizes L = { <w> | w ∈ Σ* \\ {>} and |w| ≥ 1 }. Once the opening bracket "<" is read, the automaton transitions to state q1 and consumes characters until the closing bracket ">" transitions it to accept state q2 (triggering markup purging).',
    alphabet: ['<', '>', 'c (any other char)'],
    startState: 'q0',
    acceptStates: ['q2'],
    states: [
      {
        id: 'q0',
        label: 'q0',
        x: 100,
        y: 160,
        isStart: true,
        description: 'Initial state: Scanning normal text stream.',
      },
      {
        id: 'q1',
        label: 'q1',
        x: 320,
        y: 160,
        description: 'Inside Tag: Consuming tag name, attributes, and values.',
      },
      {
        id: 'q2',
        label: 'q2',
        x: 540,
        y: 160,
        isAccept: true,
        description: 'Accept state: Complete valid HTML tag detected. Strips token.',
      },
      {
        id: 'q_dead',
        label: 'q_trap',
        x: 320,
        y: 290,
        description: 'Trap state: Malformed syntax or unclosed sequence.',
      },
    ],
    transitions: [
      { from: 'q0', to: 'q1', symbol: '<', displaySymbol: "'<'" },
      { from: 'q0', to: 'q0', symbol: 'other', displaySymbol: "Σ \\ {'<'}", curve: -35 },
      { from: 'q1', to: 'q1', symbol: 'char', displaySymbol: "Σ \\ {'>', '<'}", curve: -35 },
      { from: 'q1', to: 'q2', symbol: '>', displaySymbol: "'>'" },
      { from: 'q1', to: 'q_dead', symbol: '<', displaySymbol: "'<' (nested/error)" },
      { from: 'q2', to: 'q0', symbol: 'other', displaySymbol: "reset on next char", curve: 45 },
      { from: 'q2', to: 'q1', symbol: '<', displaySymbol: "'<' (immediate next tag)" },
      { from: 'q_dead', to: 'q_dead', symbol: 'other', displaySymbol: 'any char', curve: 30 },
    ],
    sampleInputs: [
      { label: 'Standard Tag: <p>', text: '<p>', expected: 'accept' },
      { label: 'Tag with Attributes: <div class="box">', text: '<div class="box">', expected: 'accept' },
      { label: 'Self Closing: <img src="x"/>', text: '<img src="x"/>', expected: 'accept' },
      { label: 'Unclosed Angle: <span', text: '<span', expected: 'reject' },
      { label: 'Standard Sentence', text: 'Hello World', expected: 'reject' },
    ],
  },

  space: {
    id: 'space',
    name: 'Whitespace Compressor DFA',
    regularExpression: '[ \\t]{2,}',
    description: 'Collapses 2 or more contiguous whitespace characters into a single space while streaming.',
    theoryNotes:
      'Recognizes consecutive runs of whitespace tokens. State q0 tracks non-space text. The first space moves to state q1 (preserved). Any subsequent space moves to accept state q2 (excess redundant space marked for purging).',
    alphabet: ['s (space/tab)', 'c (non-whitespace)'],
    startState: 'q0',
    acceptStates: ['q2'],
    states: [
      {
        id: 'q0',
        label: 'q0',
        x: 110,
        y: 160,
        isStart: true,
        description: 'Reading standard non-whitespace token.',
      },
      {
        id: 'q1',
        label: 'q1',
        x: 320,
        y: 160,
        description: 'First space encountered (admissible single space).',
      },
      {
        id: 'q2',
        label: 'q2',
        x: 540,
        y: 160,
        isAccept: true,
        description: 'Accept state: 2nd+ space detected (redundant noise).',
      },
    ],
    transitions: [
      { from: 'q0', to: 'q0', symbol: 'non_space', displaySymbol: 'non-space', curve: -35 },
      { from: 'q0', to: 'q1', symbol: 'space', displaySymbol: 'space / tab' },
      { from: 'q1', to: 'q2', symbol: 'space', displaySymbol: '2nd space / tab' },
      { from: 'q1', to: 'q0', symbol: 'non_space', displaySymbol: 'non-space', curve: 35 },
      { from: 'q2', to: 'q2', symbol: 'space', displaySymbol: '3rd+ space', curve: -35 },
      { from: 'q2', to: 'q0', symbol: 'non_space', displaySymbol: 'non-space', curve: 55 },
    ],
    sampleInputs: [
      { label: 'Triple Space: "   "', text: '   ', expected: 'accept' },
      { label: 'Double Space: "  "', text: '  ', expected: 'accept' },
      { label: 'Single Space: " "', text: ' ', expected: 'reject' },
      { label: 'Word with Multi-Space: "word   word"', text: 'word   word', expected: 'accept' },
      { label: 'Plain Word: "NLP"', text: 'NLP', expected: 'reject' },
    ],
  },

  url: {
    id: 'url',
    name: 'Network Protocol & URL Recognizer DFA',
    regularExpression: '(?:https?|ftp)://|www\\.',
    description: 'Deterministic prefix scanner recognizing standard network URI schemes without backtracking.',
    theoryNotes:
      'Prefix trie converted into a minimal DFA recognizing {http://, https://, ftp://, www.}. After the protocol boundary is verified, it accepts the token for domain stripping.',
    alphabet: ['h', 't', 'p', 's', 'f', 'w', ':', '/', '.'],
    startState: 'q0',
    acceptStates: ['q_ACCEPT'],
    states: [
      { id: 'q0', label: 'q0', x: 80, y: 160, isStart: true, description: 'Start state.' },
      { id: 'q_h', label: 'q_h', x: 170, y: 80, description: "Scanned 'h'" },
      { id: 'q_ht', label: 'q_ht', x: 260, y: 80, description: "Scanned 'ht'" },
      { id: 'q_htt', label: 'q_htt', x: 350, y: 80, description: "Scanned 'htt'" },
      { id: 'q_http', label: 'q_http', x: 440, y: 80, description: "Scanned 'http'" },
      { id: 'q_https', label: 'q_https', x: 520, y: 80, description: "Scanned 'https'" },
      { id: 'q_col', label: 'q_col', x: 600, y: 120, description: "Scanned ':'" },
      { id: 'q_s1', label: 'q_s1', x: 670, y: 140, description: "Scanned '/'" },
      { id: 'q_w1', label: 'q_w1', x: 200, y: 240, description: "Scanned 'w'" },
      { id: 'q_w2', label: 'q_w2', x: 320, y: 240, description: "Scanned 'ww'" },
      { id: 'q_w3', label: 'q_w3', x: 440, y: 240, description: "Scanned 'www'" },
      { id: 'q_ACCEPT', label: 'q_ACCEPT', x: 740, y: 180, isAccept: true, description: 'Protocol accept state.' },
    ],
    transitions: [
      { from: 'q0', to: 'q_h', symbol: 'h', displaySymbol: "'h'" },
      { from: 'q0', to: 'q_w1', symbol: 'w', displaySymbol: "'w'" },
      { from: 'q_h', to: 'q_ht', symbol: 't', displaySymbol: "'t'" },
      { from: 'q_ht', to: 'q_htt', symbol: 't', displaySymbol: "'t'" },
      { from: 'q_htt', to: 'q_http', symbol: 'p', displaySymbol: "'p'" },
      { from: 'q_http', to: 'q_https', symbol: 's', displaySymbol: "'s'" },
      { from: 'q_http', to: 'q_col', symbol: ':', displaySymbol: "':'" },
      { from: 'q_https', to: 'q_col', symbol: ':', displaySymbol: "':'" },
      { from: 'q_col', to: 'q_s1', symbol: '/', displaySymbol: "'/'" },
      { from: 'q_s1', to: 'q_ACCEPT', symbol: '/', displaySymbol: "'/'" },
      { from: 'q_w1', to: 'q_w2', symbol: 'w', displaySymbol: "'w'" },
      { from: 'q_w2', to: 'q_w3', symbol: 'w', displaySymbol: "'w'" },
      { from: 'q_w3', to: 'q_ACCEPT', symbol: '.', displaySymbol: "'.'" },
    ],
    sampleInputs: [
      { label: 'Secure HTTPS: https://', text: 'https://', expected: 'accept' },
      { label: 'Plain HTTP: http://', text: 'http://', expected: 'accept' },
      { label: 'Web Prefix: www.', text: 'www.', expected: 'accept' },
      { label: 'Full URL: https://ai.google.com', text: 'https://ai.google.com', expected: 'accept' },
      { label: 'Invalid Prefix: htp://', text: 'htp://', expected: 'reject' },
    ],
  },
};

/**
 * Executes a simulated step-by-step traversal of the DFA
 */
export function runDfaSimulation(dfa: DFAModel, inputStr: string): SimulationStep[] {
  const steps: SimulationStep[] = [];
  let currentState = dfa.startState;

  if (inputStr.length === 0) {
    return [
      {
        stepIndex: 0,
        char: 'ε',
        fromState: currentState,
        toState: currentState,
        transitionFound: false,
        isAcceptState: dfa.acceptStates.includes(currentState),
        explanation: 'Empty string input. Automaton remains in start state.',
      },
    ];
  }

  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    let nextState = currentState;
    let found = false;
    let explanation = '';

    if (dfa.id === 'html') {
      if (currentState === 'q0') {
        if (char === '<') {
          nextState = 'q1';
          found = true;
          explanation = `Read '<'. Transitioned from q0 to q1 (inside tag).`;
        } else {
          nextState = 'q0';
          found = true;
          explanation = `Read regular text '${char}'. Looped in q0.`;
        }
      } else if (currentState === 'q1') {
        if (char === '>') {
          nextState = 'q2';
          found = true;
          explanation = `Read closing '>'. Transitioned to accept state q2!`;
        } else if (char === '<') {
          nextState = 'q_dead';
          found = true;
          explanation = `Unexpected '<' inside tag. Transitioned to error trap state.`;
        } else {
          nextState = 'q1';
          found = true;
          explanation = `Read tag content '${char}'. Looped in q1.`;
        }
      } else if (currentState === 'q2') {
        if (char === '<') {
          nextState = 'q1';
          found = true;
          explanation = `Immediate next tag start '<'. Transitioned to q1.`;
        } else {
          nextState = 'q0';
          found = true;
          explanation = `Read '${char}' after tag closure. Returned to q0.`;
        }
      } else {
        nextState = 'q_dead';
        found = true;
        explanation = `In trap state. Reading '${char}' remains in trap.`;
      }
    } else if (dfa.id === 'space') {
      const isSpace = char === ' ' || char === '\t';
      if (currentState === 'q0') {
        if (isSpace) {
          nextState = 'q1';
          found = true;
          explanation = `Read first space. Transitioned to q1 (preserve admissible single space).`;
        } else {
          nextState = 'q0';
          found = true;
          explanation = `Read non-space character '${char}'. Looped in q0.`;
        }
      } else if (currentState === 'q1') {
        if (isSpace) {
          nextState = 'q2';
          found = true;
          explanation = `Read 2nd consecutive space. Transitioned to ACCEPT state q2 (redundant noise detected).`;
        } else {
          nextState = 'q0';
          found = true;
          explanation = `Read character '${char}'. Returned to q0.`;
        }
      } else if (currentState === 'q2') {
        if (isSpace) {
          nextState = 'q2';
          found = true;
          explanation = `Read another extra space. Looped in ACCEPT state q2.`;
        } else {
          nextState = 'q0';
          found = true;
          explanation = `Read character '${char}'. Resets back to q0.`;
        }
      }
    } else if (dfa.id === 'url') {
      // URL Prefix transitions
      const t = dfa.transitions.find((trans) => trans.from === currentState && trans.symbol === char);
      if (t) {
        nextState = t.to;
        found = true;
        explanation = `Read '${char}'. Followed transition to ${nextState}.`;
      } else if (currentState === 'q_ACCEPT') {
        // In accept state for URL, continues consuming URL characters
        nextState = 'q_ACCEPT';
        found = true;
        explanation = `Protocol confirmed. Consuming URL body '${char}' in accept state.`;
      } else {
        // Fallback / reject path
        found = false;
        explanation = `No valid transition for '${char}' from state ${currentState}. State machine halts or rejects.`;
      }
    }

    steps.push({
      stepIndex: i,
      char,
      fromState: currentState,
      toState: nextState,
      transitionFound: found,
      isAcceptState: dfa.acceptStates.includes(nextState),
      explanation,
    });

    currentState = nextState;
  }

  return steps;
}
