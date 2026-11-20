export type BuildProfile = 'debug' | 'release' | 'blazingly-fast';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface BuildStep {
  id: number;
  verb: 'Downloading' | 'Checking' | 'Compiling' | 'Borrowing' | 'Optimizing' | 'Linking' | 'Verifying';
  message: string;
  targetProgress: number;
  durationMs: number;
}

export interface TipItem {
  kind: 'Fun Fact' | 'Tip';
  text: string;
}

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set([
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'bmp',
  'avif',
  'svg',
  'heic',
  'heif',
]);

export const BUILD_PROFILES: ReadonlyArray<{
  id: BuildProfile;
  label: string;
  flag: string;
  description: string;
}> = [
  {
    id: 'debug',
    label: 'Debug',
    flag: 'cargo build',
    description: 'Standard borrow-checker lecture included.',
  },
  {
    id: 'release',
    label: 'Release',
    flag: 'cargo build --release',
    description: 'Full LLVM optimization passes.',
  },
  {
    id: 'blazingly-fast',
    label: 'Blazingly Fast',
    flag: 'RUSTFLAGS="-C target-cpu=native"',
    description: 'Zero-cost abstractions turned up to 11.',
  },
];

export const TIPS_AND_FUN_FACTS: ReadonlyArray<TipItem> = [
  {
    kind: 'Fun Fact',
    text: "Yo momma is so fat, she doesn't need the internet—she's already worldwide.",
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so fat, when she stepped on the scale, it said: "To be continued."',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so old, her social security number is 1.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so dumb, she stared at a carton of orange juice for two hours because it said "Concentrate."',
  },
  {
    kind: 'Fun Fact',
    text: "Yo momma is so fat, Google Earth can't even capture her in one image.",
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so old, when she was born, the Dead Sea was still just getting sick.',
  },
  {
    kind: 'Fun Fact',
    text: "Yo momma is so dumb, she got fired from the M&M factory for throwing away all the W's.",
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so poor, the ducks throw bread at her.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so broke, the homeless people give her change.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so old, she sat behind Jesus in math class.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so fat, it took two buses and a train just to get to her good side.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so old, her first diary was written on stone tablets.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so fat, when she fell on the sidewalk, she cracked it up.',
  },
  {
    kind: 'Fun Fact',
    text: 'Yo momma is so stupid, she told me to meet her at the corner of Walk and Don’t Walk.',
  },
  {
    kind: 'Tip',
    text: 'If the borrow checker refuses to let two siblings borrow the car at once, wrap the keys in an Arc<Mutex<Car>>.',
  },
  {
    kind: 'Tip',
    text: 'Never call .unwrap() on "We have food at home"—always handle the Option<Dinner> gracefully with a match arm.',
  },
];

export function validateMotherImageFile(
  file: { name: string; type: string; size: number } | null,
): ImageValidationResult {
  if (!file) {
    return {
      valid: false,
      error: 'Upload a picture of your mother first so Cargo has something to borrow-check.',
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  const isImageMime = file.type.startsWith('image/');
  const isImageExt = IMAGE_EXTENSIONS.has(ext);

  if (!isImageMime && !isImageExt) {
    return {
      valid: false,
      error: 'That file does not look like an image. Upload a PNG, JPG, GIF, or WebP picture.',
    };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected image file is empty (0 bytes).',
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: 'Image exceeds the 15 MB limit. Even Rust cannot monomorphize a bitmap that large.',
    };
  }

  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function sanitizeCommentText(value: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').trim();
}

export function formatCompilationTime(durationMs: number): string {
  const clampedMs = Math.max(10, durationMs);
  return `${(clampedMs / 1000).toFixed(2)}s`;
}

export function generateRustCode(): string {
  return `
fn main() {
    println!("your mother");
}
`;
}

export function buildProcessSteps(
  profile: BuildProfile = 'release',
  sourceFilename = 'mother_photo.png',
  random: () => number = Math.random,
): BuildStep[] {
  const safeName = sanitizeCommentText(sourceFilename) || 'mother_photo.png';
  const flagSuffix =
    profile === 'blazingly-fast'
      ? 'with -C opt-level=3 -C lto=fat'
      : profile === 'release'
        ? 'with --release optimizations'
        : 'with debug symbols';

  const nextDuration = () => Math.round(200 + random() * 620);

  const rawSteps: Array<{
    verb: BuildStep['verb'];
    message: string;
    targetProgress: number;
  }> = [
    {
      verb: 'Downloading',
      message: 'Fetching crates.io index for your_mother_vision',
      targetProgress: 7,
    },
    {
      verb: 'Downloading',
      message: 'Resolving 418 transitive dependencies for image_borrow_checker',
      targetProgress: 15,
    },
    {
      verb: 'Checking',
      message: `Decoding pixels from "${safeName}" into memory-safe slices`,
      targetProgress: 23,
    },
    {
      verb: 'Borrowing',
      message: "Negotiating 'static lifetime boundaries for your mother",
      targetProgress: 32,
    },
    {
      verb: 'Compiling',
      message: 'zero_cost_guilt_trip v0.9.4 (your_mother)',
      targetProgress: 41,
    },
    {
      verb: 'Borrowing',
      message: 'Resolving mutable borrow conflict in your_mother::photo_album',
      targetProgress: 50,
    },
    {
      verb: 'Compiling',
      message: 'fearless_passive_aggression v2.1.0',
      targetProgress: 59,
    },
    {
      verb: 'Checking',
      message: 'Stripping JPEG artifacts and purging legacy C++ pointers',
      targetProgress: 68,
    },
    {
      verb: 'Optimizing',
      message: `Compressing 4K maternal disapproval into println! ${flagSuffix}`,
      targetProgress: 77,
    },
    {
      verb: 'Compiling',
      message: 'your_mother v1.0.0 (/src/main.rs)',
      targetProgress: 86,
    },
    {
      verb: 'Linking',
      message: 'Monomorphizing generic traits and discarding raw pixel buffers',
      targetProgress: 94,
    },
    {
      verb: 'Verifying',
      message: 'Running clippy::pedantic on your mother (0 warnings, blazingly fast)',
      targetProgress: 100,
    },
  ];

  return rawSteps.map((step, index) => ({
    ...step,
    id: index + 1,
    durationMs: nextDuration(),
  }));
}

export function pickNextTipIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (currentIndex + 1) % total;
}
