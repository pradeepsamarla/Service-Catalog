import { useCallback, useMemo, useState } from 'react';
import { FlowCanvas } from './components/FlowCanvas';
import { GradientBackdrop } from './components/GradientBackdrop';
import { ServiceContextBar } from './components/ServiceContextBar';
import { ServiceOverview } from './components/ServiceOverview';
import { Sidebar } from './components/Sidebar';
import { TitleBar } from './components/TitleBar';
import { parseWorkbook } from './data/parseWorkbook';
import { sampleCatalog } from './flow/sampleCatalog';
import type { Service } from './flow/types';
import { ThemeProvider } from './theme/ThemeContext';

function AppShell() {
  const [services, setServices] = useState<Service[]>(sampleCatalog);
  const [source, setSource] = useState('Sample data');
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selection, setSelection] = useState<{
    serviceId: string;
    subServiceId: string | null;
  }>({
    serviceId: sampleCatalog[0].id,
    subServiceId: null,
  });

  const service =
    services.find((entry) => entry.id === selection.serviceId) ?? services[0];
  const subService =
    service.subServices.find((entry) => entry.id === selection.subServiceId) ?? null;

  const handleImport = useCallback(async (file: File) => {
    try {
      const parsed = await parseWorkbook(file);
      setServices(parsed);
      setSelection({ serviceId: parsed[0].id, subServiceId: null });
      setSource(file.name);
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read that workbook.');
    }
  }, []);

  const handleSelect = useCallback((serviceId: string, subServiceId: string | null) => {
    setSelection({ serviceId, subServiceId });
  }, []);

  const canvasPadding = useMemo(
    () => (panelOpen ? 'pl-[300px]' : 'pl-[60px]'),
    [panelOpen],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <GradientBackdrop />

      <TitleBar
        service={service}
        subService={subService}
        source={source}
        error={error}
        onImport={handleImport}
      />

      <Sidebar
        services={services}
        selectedServiceId={service.id}
        selectedSubServiceId={subService?.id ?? null}
        open={panelOpen}
        onToggle={() => setPanelOpen((current) => !current)}
        onSelect={handleSelect}
      />

      <div className={`absolute inset-0 flex flex-col pt-[68px] ${canvasPadding}`}>
        {subService ? (
          <>
            <ServiceContextBar
              service={service}
              subService={subService}
              onOpenService={() => handleSelect(service.id, null)}
              onSelectSubService={(subServiceId) => handleSelect(service.id, subServiceId)}
            />
            <div className="min-h-0 flex-1 pb-14 pr-4 pt-2">
              <FlowCanvas subService={subService} />
            </div>
          </>
        ) : (
          <ServiceOverview
            service={service}
            onOpenSubService={(subServiceId) => handleSelect(service.id, subServiceId)}
          />
        )}
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
