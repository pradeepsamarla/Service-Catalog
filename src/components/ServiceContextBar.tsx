import { Boxes, ChevronRight } from 'lucide-react';
import type { Service, SubService } from '../flow/types';

type ServiceContextBarProps = {
  service: Service;
  subService: SubService;
  onOpenService: () => void;
  onSelectSubService: (subServiceId: string) => void;
};

export function ServiceContextBar({
  service,
  subService,
  onOpenService,
  onSelectSubService,
}: ServiceContextBarProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b px-5 py-2.5"
      style={{ background: 'var(--surface-raised)', borderColor: 'var(--border)' }}
    >
      <button
        type="button"
        onClick={onOpenService}
        className="flex items-center gap-2 rounded-md px-2 py-1"
        style={{ color: 'var(--accent)' }}
      >
        <Boxes className="h-3.5 w-3.5" strokeWidth={1.9} />
        <span className="text-[12px] font-semibold">{service.name}</span>
      </button>

      <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} style={{ color: 'var(--text-subtle)' }} />

      <span className="text-[12px] font-semibold" style={{ color: 'var(--text)' }}>
        {subService.name}
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        {service.subServices.map((sub) => {
          const active = sub.id === subService.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubService(sub.id)}
              className="rounded-full border px-2.5 py-[3px] text-[10.5px] font-medium"
              style={{
                background: active ? 'var(--accent)' : 'var(--chip-bg)',
                color: active ? '#ffffff' : 'var(--chip-text)',
                borderColor: active ? 'var(--accent)' : 'var(--border)',
              }}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
