import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Network,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { DFA_MODELS, runDfaSimulation } from '../lib/automataData';
import { DFAModel, DFAState, DFATransition } from '../types/cleaner';

export const AutomataStudio: React.FC = () => {
  const [selectedDfaId, setSelectedDfaId] = useState<'html' | 'space' | 'url'>('html');
  const dfa: DFAModel = DFA_MODELS[selectedDfaId];

  // Test String State
  const [inputString, setInputString] = useState<string>('<p>');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1000);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute all simulation steps for the current string
  const simulationSteps = useMemo(() => {
    return runDfaSimulation(dfa, inputString);
  }, [dfa, inputString]);

  // Current state at current step
  const currentStep = simulationSteps[currentStepIndex] || simulationSteps[0];
  const currentStateId =
    currentStepIndex === 0
      ? dfa.startState
      : simulationSteps[currentStepIndex - 1]?.toState || dfa.startState;

  const isCompleted = currentStepIndex >= simulationSteps.length;
  const lastStep = simulationSteps[simulationSteps.length - 1];
  const isFinalAccepted = lastStep?.isAcceptState ?? false;

  // Reset step when dfa or input changes
  const handleSelectDfa = (id: 'html' | 'space' | 'url') => {
    setSelectedDfaId(id);
    const newDfa = DFA_MODELS[id];
    const defaultSample = newDfa.sampleInputs[0]?.text || '';
    setInputString(defaultSample);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputString(sampleText);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Step Controls
  const handleStepForward = () => {
    if (currentStepIndex < simulationSteps.length) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < simulationSteps.length) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speedMs);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, simulationSteps.length, speedMs]);

  // Helper for SVG rendering of transitions
  const renderTransitions = () => {
    return dfa.transitions.map((t, idx) => {
      const fromState = dfa.states.find((s) => s.id === t.from);
      const toState = dfa.states.find((s) => s.id === t.to);
      if (!fromState || !toState) return null;

      const isCurrentTransition =
        currentStepIndex > 0 &&
        simulationSteps[currentStepIndex - 1]?.fromState === t.from &&
        simulationSteps[currentStepIndex - 1]?.toState === t.to;

      // Self Loop
      if (t.from === t.to) {
        const loopRadius = 24;
        const cx = fromState.x;
        const cy = fromState.y - 28;
        return (
          <g key={`loop-${idx}`} className="transition-all duration-300">
            <path
              d={`M ${cx - 15} ${fromState.y - 18} C ${cx - 30} ${cy - 20}, ${cx + 30} ${cy - 20}, ${
                cx + 15
              } ${fromState.y - 18}`}
              fill="none"
              stroke={isCurrentTransition ? '#10B981' : '#334155'}
              strokeWidth={isCurrentTransition ? 3 : 1.5}
              markerEnd="url(#arrowhead)"
            />
            <text
              x={cx}
              y={cy - 25}
              textAnchor="middle"
              className={`text-[10px] font-mono ${
                isCurrentTransition ? 'fill-emerald-400 font-bold' : 'fill-slate-400'
              }`}
            >
              {t.displaySymbol || t.symbol}
            </text>
          </g>
        );
      }

      // Transition between different nodes
      const dx = toState.x - fromState.x;
      const dy = toState.y - fromState.y;
      const curve = t.curve || 0;

      // Midpoint with curve offset
      const mx = (fromState.x + toState.x) / 2;
      const my = (fromState.y + toState.y) / 2 + curve;

      const pathData = `M ${fromState.x} ${fromState.y} Q ${mx} ${my} ${toState.x} ${toState.y}`;

      return (
        <g key={`trans-${idx}`} className="transition-all duration-300">
          <path
            d={pathData}
            fill="none"
            stroke={isCurrentTransition ? '#3B82F6' : '#334155'}
            strokeWidth={isCurrentTransition ? 3 : 1.5}
            strokeDasharray={isCurrentTransition ? 'none' : 'none'}
            markerEnd={isCurrentTransition ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
          />
          <text
            x={mx}
            y={my - 6}
            textAnchor="middle"
            className={`text-[10px] font-mono select-none ${
              isCurrentTransition ? 'fill-blue-400 font-bold' : 'fill-slate-400'
            }`}
          >
            {t.displaySymbol || t.symbol}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Automata Model Selector Tabs */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">
              Formal DFA State Machine Architecture
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Deterministic O(n)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Choose a formal finite automaton to inspect its 5-tuple, view state diagrams, and simulate
            input strings step-by-step.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#121b2f] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => handleSelectDfa('html')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              selectedDfaId === 'html'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            HTML Tag DFA
          </button>
          <button
            onClick={() => handleSelectDfa('space')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              selectedDfaId === 'space'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Whitespace DFA
          </button>
          <button
            onClick={() => handleSelectDfa('url')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
              selectedDfaId === 'url'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            URL Protocol DFA
          </button>
        </div>
      </div>

      {/* Formal 5-Tuple Mathematical Specification Box */}
      <div className="bg-[#0d1424] border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {dfa.name}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                L(Regex) = {dfa.regularExpression}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{dfa.description}</p>
          </div>

          <div className="text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            Formal Model: <span className="text-emerald-400 font-bold">M = (Q, Σ, δ, q0, F)</span>
          </div>
        </div>

        {/* 5-tuple components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs font-mono">
          <div className="bg-[#11192e] p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-blue-400 font-bold">Q (States): </span>
            <span className="text-slate-300">
              {'{'} {dfa.states.map((s) => s.label).join(', ')} {'}'}
            </span>
          </div>

          <div className="bg-[#11192e] p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-indigo-400 font-bold">Σ (Alphabet): </span>
            <span className="text-slate-300">
              {'{'} {dfa.alphabet.join(', ')} {'}'}
            </span>
          </div>

          <div className="bg-[#11192e] p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-amber-400 font-bold">q0 (Start State): </span>
            <span className="text-slate-300">{dfa.startState}</span>
          </div>

          <div className="bg-[#11192e] p-2.5 rounded-lg border border-slate-800/60">
            <span className="text-emerald-400 font-bold">F (Accept States): </span>
            <span className="text-emerald-300 font-bold">
              {'{'} {dfa.acceptStates.join(', ')} {'}'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive SVG State Transition Diagram Canvas */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-[#101728] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              State Transition Diagram (δ Graph)
            </h3>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center space-x-3">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full border-2 border-emerald-400 inline-block" />
              <span>Accepting State (F)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span>Active State (Sim)</span>
            </span>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative w-full overflow-x-auto p-4 flex justify-center bg-[#070b14]">
          <svg
            className="w-full max-w-4xl h-72 select-none"
            viewBox="0 0 820 340"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#64748b" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#3B82F6" />
              </marker>
            </defs>

            {/* Start Arrow into Start State */}
            {(() => {
              const startState = dfa.states.find((s) => s.isStart);
              if (!startState) return null;
              return (
                <g>
                  <path
                    d={`M ${startState.x - 50} ${startState.y} L ${startState.x - 22} ${startState.y}`}
                    stroke="#94a3b8"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={startState.x - 55}
                    y={startState.y - 8}
                    className="text-[10px] font-mono fill-slate-400 font-bold"
                  >
                    start
                  </text>
                </g>
              );
            })()}

            {/* Transitions (Curved and self loops) */}
            {renderTransitions()}

            {/* State Nodes */}
            {dfa.states.map((state) => {
              const isCurrent = currentStateId === state.id;
              const isAccept = state.isAccept;

              return (
                <g key={state.id} className="cursor-pointer">
                  {/* Outer active glow */}
                  {isCurrent && (
                    <circle
                      cx={state.x}
                      cy={state.y}
                      r="28"
                      className="fill-blue-500/20 stroke-blue-400 stroke-2 animate-pulse"
                    />
                  )}

                  {/* Accept state double ring */}
                  {isAccept && (
                    <circle
                      cx={state.x}
                      cy={state.y}
                      r="24"
                      className={`fill-transparent stroke-2 ${
                        isCurrent ? 'stroke-emerald-400' : 'stroke-emerald-600'
                      }`}
                    />
                  )}

                  {/* Main State Circle */}
                  <circle
                    cx={state.x}
                    cy={state.y}
                    r="20"
                    className={`stroke-2 transition-all duration-300 ${
                      isCurrent
                        ? 'fill-blue-600 stroke-blue-300 shadow-lg'
                        : isAccept
                        ? 'fill-[#0d231a] stroke-emerald-500'
                        : 'fill-[#131d31] stroke-slate-600 hover:stroke-slate-400'
                    }`}
                  />

                  {/* Label */}
                  <text
                    x={state.x}
                    y={state.y + 4}
                    textAnchor="middle"
                    className={`text-xs font-mono font-bold select-none ${
                      isCurrent ? 'fill-white' : isAccept ? 'fill-emerald-300' : 'fill-slate-300'
                    }`}
                  >
                    {state.label}
                  </text>

                  {/* Tooltip / Description text underneath */}
                  <text
                    x={state.x}
                    y={state.y + 36}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-sans select-none max-w-xs"
                  >
                    {state.description.split(':')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Step-by-Step Automaton String Simulator */}
      <div className="bg-[#0e1524] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Step-by-Step DFA String Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any test string or select a preset to trace state transitions step-by-step.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Presets:</span>
            {dfa.sampleInputs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(sample.text)}
                className={`text-[11px] font-mono px-2 py-1 rounded transition cursor-pointer border ${
                  inputString === sample.text
                    ? 'bg-blue-600 text-white border-blue-400'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {sample.label.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Simulation Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6">
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Input String to Simulate:
            </label>
            <input
              type="text"
              value={inputString}
              onChange={(e) => {
                setInputString(e.target.value);
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              placeholder="Enter text to feed into DFA..."
              className="w-full bg-[#0a0f1d] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Player controls */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-2 pt-5 md:pt-0 justify-start md:justify-end">
            <button
              onClick={handleStepBackward}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition cursor-pointer"
              title="Step Backward (Previous Char)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{currentStepIndex >= simulationSteps.length ? 'Replay' : 'Play Sim'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStepIndex >= simulationSteps.length}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition cursor-pointer"
              title="Step Forward (Next Char)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
            >
              <option value={1500}>0.7x Speed</option>
              <option value={1000}>1.0x Speed</option>
              <option value={500}>2.0x Speed</option>
            </select>
          </div>
        </div>

        {/* Automaton Tape / String Head */}
        <div className="bg-[#090e1a] p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Automaton Input Tape & Head Position:</span>
            <span className="font-mono text-slate-300">
              Step {currentStepIndex} of {simulationSteps.length}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto py-2">
            {inputString.split('').map((char, idx) => {
              const isCurrent = idx === currentStepIndex - 1;
              const isProcessed = idx < currentStepIndex - 1;
              const isNext = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`w-9 h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold border transition-all duration-300 shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : isProcessed
                      ? 'bg-slate-800/80 border-slate-700 text-emerald-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{char === ' ' ? '␣' : char}</span>
                  <span className="text-[8px] font-normal text-slate-400">{idx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Status & Acceptance Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[#121b2f] p-3 rounded-lg border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Current State</div>
              <div className="text-sm font-mono font-bold text-white mt-0.5">
                {currentStateId}
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({dfa.states.find((s) => s.id === currentStateId)?.description.split(':')[0]})
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#121b2f] p-3 rounded-lg border border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-md bg-indigo-500/10 text-indigo-400">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Next Step Action</div>
              <div className="text-xs font-mono text-slate-200 mt-0.5">
                {currentStepIndex < simulationSteps.length
                  ? simulationSteps[currentStepIndex]?.explanation
                  : 'End of input stream reached.'}
              </div>
            </div>
          </div>

          <div className="bg-[#121b2f] p-3 rounded-lg border border-slate-800/80 flex items-center space-x-3">
            {isCompleted ? (
              isFinalAccepted ? (
                <>
                  <div className="p-2 rounded-md bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-400 font-semibold uppercase">
                      Accepted Language Member
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      w ∈ L({dfa.regularExpression}) &bull; Final in F
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-md bg-rose-500/20 text-rose-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-rose-400 font-semibold uppercase">
                      Rejected by DFA
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      w ∉ L({dfa.regularExpression}) &bull; State not in F
                    </div>
                  </div>
                </>
              )
            ) : (
              <>
                <div className="p-2 rounded-md bg-slate-800 text-slate-400">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Simulation Active</div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    Scanning input character by character...
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
