# `your-mother-rebuilt-in-rust`

> **Memory-safe, zero-cost maternal recompilation written for the modern systems era.**

`your-mother-rebuilt-in-rust` is a deterministic compilation pipeline and desktop-class workspace designed to ingest arbitrary maternal image artifacts (`PNG`, `JPEG`, `WebP`, `GIF`, `AVIF`, `HEIC`), enforce strict `'static` lifetime boundaries across legacy family structures, and emit verified, zero-warning Rust source code (`src/main.rs`) free of runtime garbage collection pauses.

---

## Motivation & Systems Guarantees

Legacy maternal implementations frequently suffer from unbounded heap allocations, non-deterministic latency during holiday dinners, and unchecked mutable aliasing across sibling threads. By migrating the entire pipeline onto Rust-grade ownership semantics, this project guarantees:

- **Zero Undefined Behavior (`#![forbid(unsafe_code)]`)**: Image validation enforces strict MIME/extension verification and a hard `15 MiB` upper memory bound (`MAX_IMAGE_BYTES`) prior to pipeline scheduling.
- **Deterministic Code Generation**: Regardless of input image entropy, aspect ratio, or JPEG compression artifacts, the compiler converges on a minimal, auditable binary entry point printing `"your mother"` with `0` compiler warnings.
- **Profile-Aware Pipeline Scheduling**: Supports `Debug` (`cargo build`), `Release` (`cargo build --release`), and `Blazingly Fast` (`RUSTFLAGS="-C target-cpu=native"`) build profiles with randomized multi-stage compilation telemetry and an exact wall-clock compilation comment.
- **Concurrent Fact Rotation**: Surfaces curated, peer-reviewed empirical observations (`Yo Momma` dataset + borrow-checker advisories) mid-compilation without blocking the main build loop.

---

## Architecture

```text
├── index.html                        # Entry document & typography bootstrapping
├── src/
│   ├── App.tsx                       # Finite-state machine (input -> rebuilding -> result)
│   ├── index.css                     # Workstation theme & reduced-motion guards
│   ├── components/
│   │   ├── DesktopWindow.tsx         # Framed desktop shell
│   │   ├── InputScreen.tsx           # Drag-and-drop image ingestion & profile selector
│   │   ├── RebuildingScreen.tsx      # Multi-stage Cargo log, progress bar & fact engine
│   │   ├── ResultScreen.tsx          # Read-only Rust source emitter, clipboard & .rs export
│   │   └── RustEmblem.tsx            # Vector cog emblem
│   └── utils/
│       ├── rustBuilder.ts            # Pure validation, step generator & Rust codegen
│       └── rustBuilder.test.ts       # Deterministic unit test suite (node:test)
└── package.json                      # Build, typecheck, and dev server manifest
```

### Compilation Pipeline

1. **Ingestion & Validation**: `validateMotherImageFile` rejects missing files, `0`-byte payloads, non-image MIME types/extensions, and payloads exceeding `15 MiB`.
2. **Stage Execution**: `buildProcessSteps` constructs a 12-phase monotonic compilation schedule (`Downloading` -> `Checking` -> `Borrowing` -> `Compiling` -> `Optimizing` -> `Linking` -> `Verifying`) with randomized per-stage latencies.
3. **Code Emission**: `generateRustCode` formats the measured compilation duration as a single top-level comment and emits valid `fn main()` Rust source code:

```rust
// Compilation time: 5.42s

fn main() {
    println!("your mother");
}
```

---

## Running Locally on Your Machine

### Prerequisites

- **Node.js** `>= 20.0.0` (includes `node:test` runner)
- **npm** `>= 10.0.0`
- *(Optional)* **Rust toolchain** (`rustc` / `cargo` via [rustup](https://rustup.rs/)) if you want to natively compile the exported `.rs` output file.

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

### 2. Launch the Development Server

Start the local workstation server on port `3000`:

```bash
npm run dev
```

Open your browser and navigate to:

```text
http://localhost:3000
```

### 3. Run the Verification Suite

Execute the unit test suite (`node:test` via `tsx`) and TypeScript static analysis:

```bash
npx tsx --test src/utils/rustBuilder.test.ts
npm run lint
```

### 4. Production Build & Preview

Compile the optimized production bundle into `dist/` and preview it locally:

```bash
npm run build
npm run preview
```

### 5. Compiling the Emitted Rust Artifact (Optional)

After exporting `your_mother.rs` from the **Rebuild Complete** screen, compile and execute it natively with `rustc`:

```bash
rustc -O your_mother.rs -o your_mother
./your_mother
```

Expected stdout:

```text
your mother
```

---

## License

Licensed under the Apache License, Version 2.0 (`SPDX-License-Identifier: Apache-2.0`).
