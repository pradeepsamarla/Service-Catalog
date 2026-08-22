import { ChevronDown, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { exportFlow, type ExportFormat } from '../flow/exportFlow';
import type { Service, SubService } from '../flow/types';
import { ThemeSwitcher } from './ThemeSwitcher';

const EXPORT_FORMATS: Array<{ format: ExportFormat; label: string; hint: string }> = [
  { format: 'png', label: 'PNG image', hint: 'Slides, tickets, chat' },
  { format: 'pdf', label: 'PDF document', hint: 'Print and sign-off' },
];

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
  const exportMenu = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [busy, setBusy] = useState<ExportFormat | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }
    const close = (event: MouseEvent) => {
      if (!exportMenu.current?.contains(event.target as globalThis.Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const runExport = async (format: ExportFormat) => {
    if (!subService) {
      return;
    }
    setBusy(format);
    setExportError(null);
    try {
      await exportFlow(service, subService, format);
      setMenuOpen(false);
    } catch {
      setExportError(`Could not export the flow as ${format.toUpperCase()}`);
    } finally {
      setBusy(null);
    }
  };

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

        {error || exportError ? (
          <span
            className="max-w-[560px] rounded-md px-2.5 py-1.5 text-[11px]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#ffd9d9',
              border: '1px solid rgba(255,180,180,0.6)',
            }}
          >
            {error ?? exportError}
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
        <div className="relative" ref={exportMenu}>
          <button
            type="button"
            disabled={!subService}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors hover:brightness-110 disabled:opacity-40"
            style={buttonStyle}
            title={subService ? 'Export this flow' : 'Open a sub-service flow to export it'}
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export
            <ChevronDown className="h-3 w-3" strokeWidth={2} />
          </button>

          {menuOpen ? (
            <div
              className="absolute right-0 z-50 mt-1.5 w-56 overflow-hidden rounded-lg border py-1 shadow-lg"
              style={{
                background: 'var(--surface-raised)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {EXPORT_FORMATS.map((entry) => (
                <button
                  key={entry.format}
                  type="button"
                  disabled={busy !== null}
                  onClick={() => void runExport(entry.format)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:brightness-95 disabled:opacity-50"
                  style={{ background: 'transparent' }}
                >
                  <span>
                    <span
                      className="block text-[12px] font-semibold"
                      style={{ color: 'var(--text)' }}
                    >
                      {entry.label}
                    </span>
                    <span className="block text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      {entry.hint}
                    </span>
                  </span>
                  {busy === entry.format ? (
                    <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>
                      …
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
