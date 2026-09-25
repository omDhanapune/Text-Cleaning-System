import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Play,
  ArrowRight,
} from 'lucide-react';
import { cleanText } from '../lib/cleanerEngine';

export const TechnicalSpecs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live API Playground State
  const [apiPayload, setApiPayload] = useState<string>(
    JSON.stringify(
      {
        text: "<div class='alert'>Welcome to <b>AI Studio</b>! Visit https://example.com/test 🔥🔥 duplicate duplicate text.</div>",
        config: {
          stripHtml: true,
          stripUrls: true,
          stripEmojis: true,
          collapseDuplicates: true,
          compressWhitespace: true,
          stripUnwantedSymbols: true,
          toLowerCase: false,
        },
      },
      null,
      2
    )
  );

  const [apiResponse, setApiResponse] = useState<string>('');
  const [isApiLoading, setIsApiLoading] = useState<boolean>(false);

  const handleCopyCode = (snippet: string, key: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRunApiTest = () => {
    setIsApiLoading(true);
    try {
      const parsed = JSON.parse(apiPayload);
      const res = cleanText(parsed.text || '', parsed.config || {});
      setTimeout(() => {
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              runtime: 'Deterministic Finite Automaton (DFA) v2.4',
              cleaned: res.cleanedText,
              metrics: res.stats,
            },
            null,
            2
          )
        );
        setIsApiLoading(false);
      }, 100);
    } catch (e: any) {
      setApiResponse(
        JSON.stringify(
          {
            status: 'error',
            message: 'Invalid JSON payload: ' + e.message,
          },
          null,
          2
        )
      );
      setIsApiLoading(false);
    }
  };

  const curlSnippet = `curl -X POST https://api.lexiclean.ai/v1/clean \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "<p>Messy review with emojis 🔥 and duplicate duplicate words.</p>",
    "config": {
      "stripHtml": true,
      "stripUrls": true,
      "stripEmojis": true,
      "collapseDuplicates": true,
      "compressWhitespace": true
    }
  }'`;

  const pythonSnippet = `import requests

payload = {
    "text": "<div>Hello world!! Visit https://ai.org 🔥🔥 the the end</div>",
    "config": {
        "stripHtml": True,
        "stripUrls": True,
        "stripEmojis": True,
        "collapseDuplicates": True,
        "compressWhitespace": True,
    }
}

response = requests.post("https://api.lexiclean.ai/v1/clean", json=payload)
data = response.json()
print("Cleaned text:", data["cleaned"])
print("Noise reduced:", data["metrics"]["reductionPercentage"], "%")`;

  return (
    <div className="space-y-6">
      {/* Overview Title Banner */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-400">
          <BookOpen className="w-5 h-5" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
            Theory of Computation (TOC) Technical Specification
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-4xl leading-relaxed">
          Formal mathematical proofs, Chomsky Hierarchy classification, time-space asymptotic complexity,
          and deterministic streaming normalization architecture.
        </p>
      </div>

      {/* 1. Kleene's Theorem & Formal Automata Theory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>1. Kleene's Theorem & Language Equivalence</span>
          </h3>

          <div className="bg-[#11192e] p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
            <div className="text-emerald-400 font-bold mb-1">Theorem (Stephen Cole Kleene, 1956):</div>
            A formal language L over an alphabet Σ is regular if and only if:
            <div className="text-center py-2 text-sm text-blue-400 font-bold">
              L(Regex) ≡ L(NFA) ≡ L(DFA)
            </div>
            Every regular expression can be converted into an equivalent Non-Deterministic Finite
            Automaton (Thompson's Construction), which in turn can be determinized into a minimal
            Deterministic Finite Automaton (Powerset Construction & Hopcroft's Algorithm).
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Under this theorem, every text-cleaning filter in LexiClean is guaranteed to run as a
            deterministic state machine without backtracking, enabling deterministic $O(n)$ scanning
            over infinite token streams.
          </p>
        </div>

        {/* 2. Formal 5-Tuple Definition */}
        <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>2. Formal 5-Tuple DFA Formulation</span>
          </h3>

          <div className="bg-[#11192e] p-3.5 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
            <div className="text-blue-400 font-bold">Mathematical Model: M = (Q, Σ, δ, q0, F)</div>
            <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-300">
              <div>
                <strong className="text-blue-300">Q:</strong> Finite, non-empty set of internal states.
              </div>
              <div>
                <strong className="text-indigo-300">Σ:</strong> Finite input alphabet (Unicode character set).
              </div>
              <div>
                <strong className="text-amber-300">δ:</strong> Transition function δ: Q × Σ → Q (Total mapping).
              </div>
              <div>
                <strong className="text-rose-300">q0:</strong> Initial start state, where q0 ∈ Q.
              </div>
              <div>
                <strong className="text-emerald-300">F:</strong> Set of accepting states, where F ⊆ Q.
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            When input string w = a₁a₂...aₙ is presented, the engine starts at state r₀ = q₀
            and iteratively computes rᵢ = δ(rᵢ₋₁, aᵢ). If rₙ ∈ F, the substring is
            sanitized or pruned.
          </p>
        </div>
      </div>

      {/* 3. Big-O Complexity & ReDoS Immunity */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>3. Algorithmic Complexity & ReDoS Vulnerability Immunity</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#11192e] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>Time Complexity: O(n)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every character $c \in \Sigma$ of input length $n$ is evaluated exactly once. State
              lookup $\delta(q, c)$ is computed in $O(1)$ constant time. Total execution time scales
              strictly linear with text volume.
            </p>
          </div>

          <div className="bg-[#11192e] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Auxiliary Space: O(1)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              The deterministic finite automaton maintains only a single active state register ($q \in Q$).
              Memory overhead remains constant regardless of whether parsing 100 bytes or 100 megabytes.
            </p>
          </div>

          <div className="bg-[#11192e] p-4 rounded-lg border border-slate-800">
            <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ReDoS Immunity (No Backtracking)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Traditional backtracking regex engines suffer from exponential worst-case runtime
              $O(2^n)$ on catastrophic inputs. LexiClean DFA execution eliminates backtracking states,
              guaranteeing continuous throughput.
            </p>
          </div>
        </div>
      </div>

      {/* 4. REST API Documentation & Interactive Tester */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>4. High-Throughput REST API Specification (POST /api/clean)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrate LexiClean into Python, Node.js, Go, or microservice ML data ingestion pipelines.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              POST /api/clean
            </span>
          </div>
        </div>

        {/* Code Snippets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#0a0f1d] border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">cURL Command</span>
              <button
                onClick={() => handleCopyCode(curlSnippet, 'curl')}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'curl' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {curlSnippet}
            </pre>
          </div>

          <div className="bg-[#0a0f1d] border border-slate-800 rounded-lg p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <span className="text-slate-400 font-mono">Python Example</span>
              <button
                onClick={() => handleCopyCode(pythonSnippet, 'python')}
                className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedCode === 'python' ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>Copy</span>
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {pythonSnippet}
            </pre>
          </div>
        </div>

        {/* Interactive Live Playground */}
        <div className="bg-[#090e1a] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Live API Request & Response Simulator
            </span>
            <button
              onClick={handleRunApiTest}
              disabled={isApiLoading}
              className="flex items-center space-x-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Send Request</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-400 font-mono mb-1">
                JSON Request Body:
              </label>
              <textarea
                value={apiPayload}
                onChange={(e) => setApiPayload(e.target.value)}
                rows={9}
                className="w-full bg-[#0a0f1d] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 font-mono mb-1">
                JSON API Response:
              </label>
              <div className="w-full bg-[#0a0f1d] border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 overflow-y-auto max-h-[195px] leading-relaxed whitespace-pre-wrap">
                {apiResponse || (
                  <span className="text-slate-600">
                    Click "Send Request" to test simulated endpoint...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
