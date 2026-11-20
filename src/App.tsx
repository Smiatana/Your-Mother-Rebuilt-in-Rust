/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { DesktopWindow } from './components/DesktopWindow';
import { InputScreen } from './components/InputScreen';
import { RebuildingScreen } from './components/RebuildingScreen';
import { ResultScreen } from './components/ResultScreen';
import type { BuildProfile } from './utils/rustBuilder';

type ScreenState = 'input' | 'rebuilding' | 'result';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('input');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<BuildProfile>('release');
  const [compilationDurationMs, setCompilationDurationMs] = useState(0);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleStartRebuild = useCallback((chosenProfile: BuildProfile) => {
    setProfile(chosenProfile);
    setScreen('rebuilding');
  }, []);

  const handleRebuildComplete = useCallback((durationMs: number) => {
    setCompilationDurationMs(durationMs);
    setScreen('result');
  }, []);

  const handleReset = useCallback(() => {
    setScreen('input');
  }, []);

  const sourceFilename = selectedFile?.name ?? 'mother_photo.png';

  return (
    <DesktopWindow>
      {screen === 'input' && (
        <InputScreen
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          initialProfile={profile}
          onSelectFile={setSelectedFile}
          onStartRebuild={handleStartRebuild}
        />
      )}

      {screen === 'rebuilding' && (
        <RebuildingScreen
          sourceFilename={sourceFilename}
          profile={profile}
          onComplete={handleRebuildComplete}
          onCancel={handleReset}
        />
      )}

      {screen === 'result' && (
        <ResultScreen
          compilationDurationMs={compilationDurationMs}
          profile={profile}
          onRebuildAnother={handleReset}
        />
      )}
    </DesktopWindow>
  );
}
