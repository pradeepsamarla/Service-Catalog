export function GradientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="wash"
        style={{
          top: '-18%',
          left: '-10%',
          width: 720,
          height: 720,
          background:
            'radial-gradient(circle at 50% 50%, var(--bg-accent-1), transparent 70%)',
        }}
      />
      <div
        className="wash"
        style={{
          bottom: '-24%',
          right: '-8%',
          width: 780,
          height: 780,
          background:
            'radial-gradient(circle at 50% 50%, var(--bg-accent-2), transparent 70%)',
          animationDelay: '-14s',
        }}
      />
    </div>
  );
}
