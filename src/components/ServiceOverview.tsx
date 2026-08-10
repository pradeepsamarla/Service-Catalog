import { Boxes, ChevronRight, Mail, Stamp, Timer, TimerOff, UserRound, Wrench } from 'lucide-react';
import type { Service, SubService } from '../flow/types';

type ServiceOverviewProps = {
  service: Service;
  onOpenSubService: (subServiceId: string) => void;
};

function metaChip(label: string, value: string) {
  return (
    <div key={label} className="flex flex-col gap-0.5">
      <span
        className="text-[9.5px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: 'var(--text-subtle)' }}
      >
        {label}
      </span>
      <span className="text-[12.5px] font-medium" style={{ color: 'var(--text)' }}>
        {value}
      </span>
    </div>
  );
}

function SubServiceCard({
  sub,
  onOpen,
}: {
  sub: SubService;
  onOpen: () => void;
}) {
  const parallel = sub.assignments.filter((item) => item.executionMode !== 'SEQUENCE').length;
  const sequential = sub.assignments.length - parallel;
  const SlaIcon = sub.sla.risk === 'none' ? TimerOff : Timer;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col gap-3 rounded-[10px] p-4 text-left transition-shadow"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div
            className="text-[9.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--text-subtle)' }}
          >
            {sub.requestType} · {sub.id}
          </div>
          <div
            className="mt-1 text-[13.5px] font-semibold leading-snug"
            style={{ color: 'var(--text)' }}
          >
            {sub.name}
          </div>
        </div>
        <ChevronRight
          className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2}
          style={{ color: 'var(--accent)' }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px] font-medium"
          style={{
            background: 'var(--chip-bg)',
            color: 'var(--chip-text)',
            borderColor: 'var(--border)',
          }}
        >
          <Stamp className="h-3 w-3" strokeWidth={1.9} />
          {sub.approvals.length ? `${sub.approvals.length} approval level${sub.approvals.length > 1 ? 's' : ''}` : 'Auto-approved'}
        </span>
        <span
          className="flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px] font-medium"
          style={{
            background: 'var(--chip-bg)',
            color: 'var(--chip-text)',
            borderColor: 'var(--border)',
          }}
        >
          <Wrench className="h-3 w-3" strokeWidth={1.9} />
          {sub.assignments.length} child ticket{sub.assignments.length === 1 ? '' : 's'}
          {sequential ? ' · sequence' : parallel > 1 ? ' · parallel' : ''}
        </span>
        <span
          className="flex items-center gap-1 rounded-full border px-2 py-[3px] text-[9.5px] font-medium"
          style={{
            background: sub.sla.risk === 'none' ? 'var(--danger-soft)' : 'var(--ok-soft)',
            color: sub.sla.risk === 'none' ? 'var(--danger)' : 'var(--ok)',
            borderColor: sub.sla.risk === 'none' ? 'var(--danger)' : 'var(--ok)',
          }}
        >
          <SlaIcon className="h-3 w-3" strokeWidth={1.9} />
          {sub.sla.label}
        </span>
      </div>
    </button>
  );
}

export function ServiceOverview({ service, onOpenSubService }: ServiceOverviewProps) {
  return (
    <div className="h-full overflow-y-auto px-8 py-6">
      <section
        className="rounded-[10px] p-5"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
          >
            <Boxes className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <div className="flex-1">
            <div
              className="text-[9.5px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: 'var(--text-subtle)' }}
            >
              Service · {service.id}
            </div>
            <h2
              className="mt-0.5 text-[19px] font-semibold leading-tight"
              style={{ color: 'var(--text)' }}
            >
              {service.name}
            </h2>
            {service.description ? (
              <p className="mt-1 text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                {service.description}
              </p>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-4">
              {metaChip('Domain', service.domain)}
              {metaChip('Sub-services', String(service.subServices.length))}
              {service.ownerName ? metaChip('Owner', service.ownerName) : null}
              {service.ownerPrId ? metaChip('Owner PR ID', service.ownerPrId) : null}
            </div>

            {service.ownerEmail ? (
              <div
                className="mt-3 flex items-center gap-1.5 text-[11.5px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <UserRound className="h-3.5 w-3.5" strokeWidth={1.8} />
                {service.ownerName}
                <Mail className="ml-2 h-3.5 w-3.5" strokeWidth={1.8} />
                {service.ownerEmail}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <h3
        className="mb-3 mt-6 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: 'var(--text-subtle)' }}
      >
        Sub-services · select one to see its flow
      </h3>

      <div className="grid grid-cols-1 gap-3 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {service.subServices.map((sub) => (
          <SubServiceCard key={sub.id} sub={sub} onOpen={() => onOpenSubService(sub.id)} />
        ))}
      </div>
    </div>
  );
}
