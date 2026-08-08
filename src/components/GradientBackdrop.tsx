export function GradientBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="blob blob-a"
        style={{
          top: '-14%',
          left: '-8%',
          width: 620,
          height: 620,
          background:
            'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.8), rgba(139,92,246,0) 70%)',
          opacity: 0.85,
        }}
      />
      <div
        className="blob blob-b"
        style={{
          top: '18%',
          right: '-12%',
          width: 680,
          height: 680,
          background:
            'radial-gradient(circle at 50% 50%, rgba(59,130,246,0.7), rgba(59,130,246,0) 70%)',
          opacity: 0.75,
        }}
      />
      <div
        className="blob blob-a"
        style={{
          bottom: '-20%',
          left: '22%',
          width: 720,
          height: 720,
          background:
            'radial-gradient(circle at 50% 50%, rgba(45,212,191,0.6), rgba(45,212,191,0) 70%)',
          opacity: 0.65,
          animationDelay: '-8s',
        }}
      />
      <div
        className="blob blob-b"
        style={{
          bottom: '4%',
          right: '18%',
          width: 460,
          height: 460,
          background:
            'radial-gradient(circle at 50% 50%, rgba(217,70,239,0.5), rgba(217,70,239,0) 70%)',
          opacity: 0.6,
          animationDelay: '-16s',
        }}
      />
      <div className="absolute inset-0 bg-canvas/20" />
    </div>
  );
}
