import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { Service } from '../flow/types';
import { ThemeSwitcher } from './ThemeSwitcher';

type TitleBarProps = {
  services: Service[];
  selected: Service;
  source: string;
  error: string | null;
  onSelectService: (name: string) => void;
  onImport: (file: File) => void;
  onDownloadTemplate: () => void;
};

const buttonStyle = {
  background: 'var(--header-control)',
  border: '1px solid var(--header-border)',
  color: 'var(--header-text)',
};

const primaryButtonStyle = {
  background: 'var(--header-text)',
  border: '1px solid var(--header-text)',
  color: 'var(--header-bg)',
};

export function TitleBar({
  services,
  selected,
  source,
  error,
  onSelectService,
  onImport,
  onDownloadTemplate,
}: TitleBarProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <header
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-6 border-b px-6 py-3"
      style={{
        borderColor: 'var(--header-border)',
        background: 'var(--header-bg)',
      }}
    >
      <div className="flex items-center gap-5">
        <div>
          <h1
            className="text-[17px] font-semibold leading-tight tracking-tight"
            style={{ color: 'var(--header-text)' }}
          >
            Service flow · {selected.name}
          </h1>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--header-muted)' }}>
            {selected.domain} · {selected.subServices.length} sub-services · {source}
          </p>
        </div>

        {services.length > 1 ? (
          <label className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--header-muted)' }}>
            Service
            <select
              value={selected.name}
              onChange={(event) => onSelectService(event.target.value)}
              className="rounded-md px-2.5 py-1.5 text-[12px] outline-none"
              style={{
                background: 'var(--header-control)',
                border: '1px solid var(--header-border)',
                color: 'var(--header-text)',
              }}
            >
              {services.map((service) => (
                <option key={service.name} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {error ? (
          <span
            className="max-w-[520px] rounded-md px-2.5 py-1.5 text-[11px]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#ffd9d9',
              border: '1px solid rgba(255,180,180,0.6)',
            }}
          >
            {error}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onImport(file);
            }
            event.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-semibold transition-opacity hover:opacity-90"
          style={primaryButtonStyle}
        >
          <Upload className="h-3.5 w-3.5" strokeWidth={2} />
          Import Excel
        </button>
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors hover:brightness-110"
          style={buttonStyle}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={1.75} />
          Template
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors hover:brightness-110"
          style={buttonStyle}
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
          Export
        </button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
