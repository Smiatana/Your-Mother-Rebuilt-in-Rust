import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_IMAGE_BYTES,
  TIPS_AND_FUN_FACTS,
  buildProcessSteps,
  formatCompilationTime,
  formatFileSize,
  generateRustCode,
  pickNextTipIndex,
  validateMotherImageFile,
} from './rustBuilder';

test('validateMotherImageFile rejects missing, non-image, empty, and oversized files', () => {
  assert.equal(validateMotherImageFile(null).valid, false);
  assert.ok(validateMotherImageFile(null).error);

  assert.equal(
    validateMotherImageFile({ name: 'notes.txt', type: 'text/plain', size: 120 }).valid,
    false,
  );
  assert.equal(
    validateMotherImageFile({ name: 'empty.png', type: 'image/png', size: 0 }).valid,
    false,
  );
  assert.equal(
    validateMotherImageFile({
      name: 'huge.jpg',
      type: 'image/jpeg',
      size: MAX_IMAGE_BYTES + 1,
    }).valid,
    false,
  );
});

test('validateMotherImageFile accepts valid image MIME types and image extensions', () => {
  assert.equal(
    validateMotherImageFile({ name: 'mom.png', type: 'image/png', size: 2048 }).valid,
    true,
  );
  assert.equal(
    validateMotherImageFile({ name: 'mom.webp', type: '', size: 4096 }).valid,
    true,
  );
});

test('formatFileSize and formatCompilationTime format values cleanly', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2048), '2.0 KB');
  assert.equal(formatFileSize(2 * 1024 * 1024), '2.00 MB');

  assert.equal(formatCompilationTime(4832), '4.83s');
  assert.equal(formatCompilationTime(0), '0.01s');
});

test('generateRustCode emits only the compilation time comment and prints "your mother"', () => {
  const code = generateRustCode(5420);
  const commentLines = code.split('\n').filter((line) => line.trim().startsWith('//'));

  assert.equal(commentLines.length, 1);
  assert.equal(commentLines[0], '// Compilation time: 5.42s');
  assert.match(code, /fn main\(\) \{/);
  assert.match(code, /println!\("your mother"\);/);
});

test('buildProcessSteps produces monotonic progress and randomizes durations via RNG', () => {
  const lowSteps = buildProcessSteps('release', 'mom.jpg', () => 0);
  const highSteps = buildProcessSteps('release', 'mom.jpg', () => 0.99);

  assert.ok(lowSteps.length >= 10);
  const lowTotal = lowSteps.reduce((sum, s) => sum + s.durationMs, 0);
  const highTotal = highSteps.reduce((sum, s) => sum + s.durationMs, 0);
  assert.ok(highTotal > lowTotal);

  let prev = 0;
  for (const step of lowSteps) {
    assert.ok(step.targetProgress > prev, `Expected ${step.targetProgress} > ${prev}`);
    assert.ok(step.durationMs > 0);
    prev = step.targetProgress;
  }
  assert.equal(lowSteps[lowSteps.length - 1].targetProgress, 100);
});

test('pickNextTipIndex cycles cleanly across Yo Momma fun facts and tips', () => {
  const funFacts = TIPS_AND_FUN_FACTS.filter((item) => item.kind === 'Fun Fact');
  assert.ok(funFacts.length >= 10);
  assert.ok(funFacts.some((item) => /yo momma/i.test(item.text)));
  assert.equal(pickNextTipIndex(0, TIPS_AND_FUN_FACTS.length), 1);
  assert.equal(pickNextTipIndex(TIPS_AND_FUN_FACTS.length - 1, TIPS_AND_FUN_FACTS.length), 0);
});
