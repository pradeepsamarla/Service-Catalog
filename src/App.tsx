import { useState } from 'react';
import { FlowCanvas } from './components/FlowCanvas';
import { GradientBackdrop } from './components/GradientBackdrop';
import { TitleBar } from './components/TitleBar';
import { sampleService } from './flow/sampleService';

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-canvas">
      <GradientBackdrop />

      <TitleBar
        title={`Flow of ${sampleService.name}`}
        parentService={sampleService.parentService}
        dark={dark}
        onToggleTheme={() => setDark((value) => !value)}
      />

      <div className="absolute inset-0 pt-24">
        <FlowCanvas />
      </div>
    </div>
  );
}
