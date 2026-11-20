import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';
import { ArrowRight, Hammer, ImageUp, Trash2, Upload } from 'lucide-react';
import {
  BUILD_PROFILES,
  formatFileSize,
  validateMotherImageFile,
  type BuildProfile,
} from '../utils/rustBuilder';

interface InputScreenProps {
  selectedFile: File | null;
  previewUrl: string | null;
  initialProfile: BuildProfile;
  onSelectFile: (file: File | null) => void;
  onStartRebuild: (profile: BuildProfile) => void;
}

export function InputScreen({
  selectedFile,
  previewUrl,
  initialProfile,
  onSelectFile,
  onStartRebuild,
}: InputScreenProps) {
  const [profile, setProfile] = useState<BuildProfile>(initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProfileMeta =
    BUILD_PROFILES.find((item) => item.id === profile) ?? BUILD_PROFILES[1];

  const handleFileCandidate = (file: File | null) => {
    const validation = validateMotherImageFile(file);
    if (!validation.valid) {
      setError(validation.error ?? 'Please upload a valid image file.');
      return;
    }
    setError(null);
    onSelectFile(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    handleFileCandidate(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileCandidate(file);
  };

  const handleRemoveFile = () => {
    onSelectFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validation = validateMotherImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error ?? 'Upload a picture of your mother first.');
      return;
    }
    setError(null);
    onStartRebuild(profile);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-stone-100 text-balance">
          Rebuild Your Mother in Rust
        </h1>
        <p className="text-base text-stone-300 leading-relaxed">
          Upload a picture of your mother below so Cargo can decode her into
          memory-safe, zero-cost Rust.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="space-y-2.5">
          <label
            htmlFor="mother-image-input"
            className="block text-sm font-medium text-stone-200"
          >
            Your mother picture
          </label>

          <input
            ref={fileInputRef}
            id="mother-image-input"
            name="motherPicture"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'mother-image-error' : undefined}
            className="sr-only"
          />

          {!selectedFile || !previewUrl ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-4 px-6 py-10 bg-[#12100e] border border-dashed rounded-xl text-center transition-colors ${
                isDragging
                  ? 'border-orange-500 bg-orange-950/20'
                  : error
                    ? 'border-red-500/80'
                    : 'border-stone-700 hover:border-stone-500'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-stone-800/80 border border-stone-700 flex items-center justify-center text-orange-400">
                <ImageUp className="w-6 h-6" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <p className="text-sm sm:text-base font-medium text-stone-200">
                  Drop your mother picture here
                </p>
                <p className="text-xs text-stone-400">
                  PNG, JPG, GIF, or WebP · Max 15 MB
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                Choose Picture
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#12100e] border border-stone-700 rounded-xl">
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={previewUrl}
                  alt={`Uploaded preview: ${selectedFile.name}`}
                  className="w-16 h-16 rounded-lg object-cover border border-stone-700 shrink-0 bg-stone-900"
                />
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium text-stone-100 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-stone-400 font-mono tabular-nums">
                    {formatFileSize(selectedFile.size)}
                    <span aria-hidden="true"> · </span>
                    <span>Ready to borrow-check</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-xs font-medium text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  Change Picture
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  aria-label="Remove uploaded picture"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-red-300 bg-stone-800/70 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          )}

          {error && (
            <p
              id="mother-image-error"
              role="alert"
              className="text-sm text-red-400 font-medium"
            >
              {error}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <span className="block text-sm font-medium text-stone-200">
            Compiler profile
          </span>
          <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#12100e] border border-stone-800 rounded-xl"
            role="group"
            aria-label="Compiler profile"
          >
            {BUILD_PROFILES.map((item) => {
              const active = item.id === profile;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setProfile(item.id)}
                  aria-pressed={active}
                  className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    active
                      ? 'bg-stone-800 text-stone-100 border border-stone-700'
                      : 'text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-stone-400">
            <span className="font-mono tracking-tight text-stone-300">
              {selectedProfileMeta.flag}
            </span>
            <span aria-hidden="true"> · </span>
            <span>{selectedProfileMeta.description}</span>
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-stone-800/80">
          <p className="text-xs text-stone-400">
            Outputs valid Rust source code ready for{' '}
            <span className="font-mono tracking-tight text-stone-300">
              rustc
            </span>
            .
          </p>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1816]"
          >
            <Hammer className="w-4 h-4" aria-hidden="true" />
            Rebuild in Rust
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
