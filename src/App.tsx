import { useCallback, useMemo, useState } from 'react';
import { FlowCanvas } from './components/FlowCanvas';
import { GradientBackdrop } from './components/GradientBackdrop';
import { TitleBar } from './components/TitleBar';
import { buildTemplateCsv, parseServiceFile } from './data/parseServices';
import { sampleServices } from './flow/sampleService';
import type { Service } from './flow/types';
import { ThemeProvider } from './theme/ThemeContext';

function AppShell() {
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [source, setSource] = useState('Sample data');
  const [selectedName, setSelectedName] = useState(sampleServices[0].name);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => services.find((service) => service.name === selectedName) ?? services[0],
    [services, selectedName],
  );

  const handleImport = useCallback(async (file: File) => {
    try {
      const parsed = await parseServiceFile(file);
      setServices(parsed);
      setSelectedName(parsed[0].name);
      setSource(file.name);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read that file.');
    }
  }, []);

  const handleDownloadTemplate = useCallback(() => {
    const blob = new Blob([buildTemplateCsv(services)], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'service-flow-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [services]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GradientBackdrop />

      <TitleBar
        services={services}
        selected={selected}
        source={source}
        error={error}
        onSelectService={setSelectedName}
        onImport={handleImport}
        onDownloadTemplate={handleDownloadTemplate}
      />

      <div className="absolute inset-0 pb-20 pl-12 pr-4 pt-24">
        <FlowCanvas service={selected} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
