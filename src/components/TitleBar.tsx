import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useRef } from 'react';
import type { Service, SubService } from '../flow/types';
import { ThemeSwitcher } from './ThemeSwitcher';

type TitleBarProps = {
  service: Service;
  subService: SubService | null;
  source: string;
  error: string | null;
  onImport: (file: File) => void;
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

export function TitleBar({ service, subService, source, error, onImport }: TitleBarProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <header
      className="absolute inset-x-0 top-0 z-40 flex items-center justify-between gap-6 border-b px-6 py-3"
      style={{ borderColor: 'var(--header-border)', background: 'var(--header-bg)' }}
    >
      <div className="flex items-center gap-5">
        <div>
          <h1
            className="text-[17px] font-semibold leading-tight tracking-tight"
            style={{ color: 'var(--header-text)' }}
          >
            {subService ? subService.name : service.name}
          </h1>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--header-muted)' }}>
            {subService ? `${service.name} · ` : ''}
            {service.domain}
            {service.ownerName ? ` · Owner ${service.ownerName}` : ''} · {source}
          </p>
        </div>

        {error ? (
          <span
            className="max-w-[560px] rounded-md px-2.5 py-1.5 text-[11px]"
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
          accept=".xlsx,.xls"
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
          Import workbook
        </button>
        <a
          href="/service-catalog-template.xlsx"
          download
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors hover:brightness-110"
          style={buttonStyle}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" strokeWidth={1.75} />
          Template
        </a>
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
