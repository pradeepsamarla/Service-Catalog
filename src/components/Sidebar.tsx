import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Service, SubService } from '../flow/types';

type SidebarProps = {
  services: Service[];
  selectedServiceId: string;
  selectedSubServiceId: string | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (serviceId: string, subServiceId: string | null) => void;
};

function matches(query: string, service: Service) {
  if (!query) {
    return { visible: true, subServices: service.subServices };
  }
  const needle = query.toLowerCase();
  const serviceHit = service.name.toLowerCase().includes(needle);
  const subHits = service.subServices.filter((sub) =>
    sub.name.toLowerCase().includes(needle),
  );
  return {
    visible: serviceHit || subHits.length > 0,
    subServices: serviceHit ? service.subServices : subHits,
  };
}

export function Sidebar({
  services,
  selectedServiceId,
  selectedSubServiceId,
  open,
  onToggle,
  onSelect,
}: SidebarProps) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const results = useMemo(
    () =>
      services
        .map((service) => ({ service, ...matches(query, service) }))
        .filter((entry) => entry.visible),
    [services, query],
  );

  if (!open) {
    return (
      <aside
        className="absolute inset-y-0 left-0 z-30 flex w-12 flex-col items-center gap-3 border-r pt-20"
        style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand service panel"
          title="Expand service panel"
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          <PanelLeftOpen className="h-4 w-4" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Search services"
          title="Search services"
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ color: 'var(--text-subtle)' }}
        >
          <Search className="h-4 w-4" strokeWidth={1.9} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      className="absolute inset-y-0 left-0 z-30 flex w-[288px] flex-col border-r pt-[68px]"
      style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3.5 py-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: 'var(--text-subtle)' }}
        >
          Service catalog
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Collapse service panel"
          title="Collapse service panel"
          className="flex h-6 w-6 items-center justify-center rounded"
          style={{ color: 'var(--text-subtle)' }}
        >
          <PanelLeftClose className="h-4 w-4" strokeWidth={1.9} />
        </button>
      </div>

      <div className="px-3.5 py-3">
        <div
          className="flex items-center gap-2 rounded-md px-2.5 py-2"
          style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}
        >
          <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.9} style={{ color: 'var(--text-subtle)' }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search service or sub-service"
            className="w-full bg-transparent text-[12px] outline-none"
            style={{ color: 'var(--text)' }}
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{ color: 'var(--text-subtle)' }}
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.9} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pb-4">
        {results.length === 0 ? (
          <p className="px-1.5 py-3 text-[12px]" style={{ color: 'var(--text-subtle)' }}>
            No service matches “{query}”.
          </p>
        ) : null}

        {results.map(({ service, subServices }) => {
          const isCollapsed = collapsed[service.id] ?? false;
          return (
            <div key={service.id} className="mb-1.5">
              <div
                className="flex items-center gap-1 rounded-md pr-2"
                style={{
                  background:
                    service.id === selectedServiceId && !selectedSubServiceId
                      ? 'var(--accent)'
                      : service.id === selectedServiceId
                        ? 'var(--accent-soft)'
                        : 'transparent',
                  color:
                    service.id === selectedServiceId && !selectedSubServiceId
                      ? '#ffffff'
                      : 'var(--text)',
                }}
              >
                <button
                  type="button"
                  aria-label={isCollapsed ? 'Expand sub-services' : 'Collapse sub-services'}
                  onClick={() =>
                    setCollapsed((current) => ({ ...current, [service.id]: !isCollapsed }))
                  }
                  className="flex h-7 w-6 items-center justify-center"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(service.id, null)}
                  className="flex-1 py-2 text-left text-[12.5px] font-semibold"
                >
                  {service.name}
                </button>
                <span
                  className="rounded-full px-1.5 py-[1px] text-[9.5px] font-semibold"
                  style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}
                >
                  {service.subServices.length}
                </span>
              </div>

              {isCollapsed ? null : (
                <ul className="mt-0.5 space-y-0.5 pl-3">
                  {subServices.map((sub: SubService) => {
                    const active = sub.id === selectedSubServiceId;
                    return (
                      <li key={sub.id}>
                        <button
                          type="button"
                          onClick={() => onSelect(service.id, sub.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px]"
                          style={{
                            background: active ? 'var(--accent)' : 'transparent',
                            color: active ? '#ffffff' : 'var(--text-muted)',
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              background: active ? '#ffffff' : 'var(--border-strong)',
                            }}
                          />
                          {sub.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
