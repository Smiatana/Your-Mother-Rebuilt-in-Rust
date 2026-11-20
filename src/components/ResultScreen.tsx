import { useMemo, useState } from 'react';
import { Check, Copy, Download, RotateCcw } from 'lucide-react';
import {
  BUILD_PROFILES,
  generateRustCode,
  type BuildProfile,
} from '../utils/rustBuilder';

interface ResultScreenProps {
  compilationDurationMs: number;
  profile: BuildProfile;
  onRebuildAnother: () => void;
}

export function ResultScreen({
  compilationDurationMs,
  profile,
  onRebuildAnother,
}: ResultScreenProps) {
  const [copied, setCopied] = useState(false);

  const rustCode = useMemo(
    () => generateRustCode(),
    [],
  );
  const profileLabel =
    BUILD_PROFILES.find((p) => p.id === profile)?.label ?? 'Release';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rustCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.getElementById(
        'rust-output-code',
      ) as HTMLTextAreaElement | null;
      if (textarea) {
        textarea.select();
        document.execCommand('copy');
        textarea.setSelectionRange(0, 0);
        textarea.blur();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rustCode], { type: 'text/rust;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'your_mother.rs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" data-testid="result-screen">
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-stone-100">
          Rebuild Complete
        </h1>
        <p className="text-sm text-stone-400">
          <span className="text-emerald-400 font-medium">0 memory leaks</span>
          <span aria-hidden="true"> · </span>
          <span>0 warnings</span>
          <span aria-hidden="true"> · </span>
          <span className="font-mono tracking-tight text-stone-300">
            your_mother
          </span>
          <span aria-hidden="true"> · </span>
          <span>{profileLabel}</span>
        </p>
      </div>

      <div className="space-y-2.5">
        <label
          htmlFor="rust-output-code"
          className="block text-sm font-medium text-stone-200"
        >
          Generated Rust code (compilation took {compilationDurationMs}ms)
        </label>
        <textarea
          id="rust-output-code"
          readOnly
          wrap="off"
          value={rustCode}
          rows={5}
          spellCheck={false}
          className="w-full p-5 bg-[#12100e] border border-stone-700 rounded-xl font-mono text-sm sm:text-base text-stone-100 leading-relaxed resize-none overflow-x-auto whitespace-pre focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        />
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800/80">
        <button
          type="button"
          onClick={onRebuildAnother}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-300 hover:text-stone-100 bg-stone-800/70 hover:bg-stone-800 border border-stone-700 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Rebuild Another
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download .rs
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
