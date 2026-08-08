const ITEMS = [
  { label: 'Intake · qualification', color: 'var(--band-intake-text)' },
  { label: 'Fulfillment · resolution', color: 'var(--band-fulfillment-text)' },
  { label: 'SLA defined', color: 'var(--ok)' },
  { label: 'No SLA', color: 'var(--danger)' },
  { label: 'No approval required', color: 'var(--text-subtle)' },
];

export function Legend() {
  return (
    <div
      className="flex items-center gap-4 rounded-md px-3.5 py-2"
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: item.color }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.1em]"
            style={{ color: 'var(--text-muted)' }}
          >
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
