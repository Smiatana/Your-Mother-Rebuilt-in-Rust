import { useEffect, useMemo, useRef, useState } from 'react';
import { FastForward, Lightbulb, RefreshCw, X } from 'lucide-react';
import {
  BUILD_PROFILES,
  TIPS_AND_FUN_FACTS,
  buildProcessSteps,
  pickNextTipIndex,
  type BuildProfile,
} from '../utils/rustBuilder';

interface RebuildingScreenProps {
  sourceFilename: string;
  profile: BuildProfile;
  onComplete: (durationMs: number) => void;
  onCancel: () => void;
}

export function RebuildingScreen({
  sourceFilename,
  profile,
  onComplete,
  onCancel,
}: RebuildingScreenProps) {
  const steps = useMemo(
    () => buildProcessSteps(profile, sourceFilename),
    [profile, sourceFilename],
  );
  const profileLabel =
    BUILD_PROFILES.find((p) => p.id === profile)?.label ?? 'Release';

  const [visibleCount, setVisibleCount] = useState(1);
  const [tipIndex, setTipIndex] = useState(() => {
    const funFactIndices = TIPS_AND_FUN_FACTS.map((item, idx) =>
      item.kind === 'Fun Fact' ? idx : -1,
    ).filter((idx) => idx >= 0);
    if (funFactIndices.length === 0) return 0;
    return funFactIndices[Math.floor(Math.random() * funFactIndices.length)];
  });
  const logContainerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentStep = steps[Math.min(visibleCount - 1, steps.length - 1)];
  const progress = currentStep ? currentStep.targetProgress : 0;
  const currentTip = TIPS_AND_FUN_FACTS[tipIndex] ?? TIPS_AND_FUN_FACTS[0];

  useEffect(() => {
    if (visibleCount >= steps.length) {
      const doneTimer = window.setTimeout(() => {
        onComplete(Date.now() - startTimeRef.current);
      }, 360);
      return () => window.clearTimeout(doneTimer);
    }

    const activeDuration = steps[visibleCount - 1]?.durationMs ?? 400;
    const stepTimer = window.setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 1, steps.length));
    }, activeDuration);

    return () => window.clearTimeout(stepTimer);
  }, [visibleCount, steps, onComplete]);

  useEffect(() => {
    const tipTimer = window.setInterval(() => {
      setTipIndex((prev) => pickNextTipIndex(prev, TIPS_AND_FUN_FACTS.length));
    }, 3400);
    return () => window.clearInterval(tipTimer);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  return (
    <div className="space-y-6" data-testid="rebuilding-screen">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
            Rebuilding...
          </h1>
          <p className="text-sm text-stone-400 truncate">
            <span>Target: </span>
            <span className="font-mono tracking-tight text-stone-200">
              your mother
            </span>
            <span aria-hidden="true"> · </span>
            <span className="font-mono tracking-tight text-stone-300">
              {sourceFilename}
            </span>
            <span aria-hidden="true"> · </span>
            <span>{profileLabel} profile</span>
          </p>
        </div>

        <div className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums text-orange-400">
          {progress}%
        </div>
      </div>

      <div
        role="progressbar"
        aria-label="Rust rebuild progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="w-full h-3 bg-stone-800 rounded-full overflow-hidden border border-stone-700/60"
      >
        <div
          className="h-full bg-orange-500 transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section
        aria-label="Build tip or fun fact"
        className="bg-stone-900/90 border border-stone-700/80 rounded-xl p-5 space-y-2.5"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-orange-400">
            <Lightbulb className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{currentTip.kind}</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setTipIndex((prev) =>
                pickNextTipIndex(prev, TIPS_AND_FUN_FACTS.length),
              )
            }
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-2 py-1"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Next
          </button>
        </div>

        <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
          {currentTip.text}
        </p>
      </section>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span>Compiler Processes</span>
          <span className="font-mono tabular-nums">
            Step {visibleCount} of {steps.length}
          </span>
        </div>

        <div
          ref={logContainerRef}
          aria-live="polite"
          data-testid="process-log"
          className="h-52 overflow-y-auto bg-[#12100e] border border-stone-800 rounded-xl p-4 font-mono text-xs sm:text-sm space-y-2"
        >
          {steps.slice(0, visibleCount).map((step, index) => {
            const isCurrent = index === visibleCount - 1 && progress < 100;
            return (
              <div key={step.id} className="flex items-start gap-3 leading-snug">
                <span
                  className={`shrink-0 w-28 font-semibold text-right ${
                    isCurrent ? 'text-orange-400' : 'text-emerald-400'
                  }`}
                >
                  {step.verb}
                </span>
                <span
                  className={
                    isCurrent ? 'text-stone-100' : 'text-stone-400'
                  }
                >
                  {step.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/80">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-300 hover:text-stone-100 bg-stone-800/70 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <X className="w-4 h-4" aria-hidden="true" />
          Cancel
        </button>

        <button
          type="button"
          onClick={() => onComplete(Date.now() - startTimeRef.current)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-300 hover:text-stone-100 bg-stone-800/70 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <FastForward className="w-4 h-4" aria-hidden="true" />
          Finish Now
        </button>
      </div>
    </div>
  );
}
