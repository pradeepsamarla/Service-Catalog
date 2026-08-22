export type ThemeId = 'dark' | 'light' | 'slate';

export type Theme = {
  id: ThemeId;
  label: string;
  description: string;
  vars: Record<string, string>;
};

export const THEMES: Theme[] = [
  {
    id: 'light',
    label: 'Corporate light',
    description: 'Corporate light — white cards, navy header, blue accent',
    vars: {
      '--bg': '#f5f7fb',
      '--bg-accent-1': 'rgba(26,79,178,0.05)',
      '--bg-accent-2': 'rgba(15,23,42,0.02)',
      '--surface': '#ffffff',
      '--surface-muted': '#f7f9fd',
      '--surface-raised': '#ffffff',
      '--border': '#dbe3f0',
      '--border-strong': '#9db6de',
      '--text': '#132345',
      '--text-muted': '#4a5a78',
      '--text-subtle': '#7b8aa6',
      '--accent': '#1a4fa3',
      '--accent-soft': '#e6eefb',
      '--header-bg': '#16357a',
      '--header-text': '#ffffff',
      '--header-muted': 'rgba(226,236,255,0.72)',
      '--header-border': 'rgba(255,255,255,0.16)',
      '--header-control': 'rgba(255,255,255,0.10)',
      '--header-control-active': 'rgba(255,255,255,0.24)',
      '--col-header-bg': '#1d47a0',
      '--col-header-text': '#ffffff',
      '--grid-dot': 'rgba(19,35,69,0.05)',
      '--edge': '#8ea3c4',
      '--edge-active': '#1a4fa3',
      '--band-request': '#eef3fb',
      '--band-intake': '#e7effc',
      '--band-fulfillment': '#e8f4f2',
      '--band-request-text': '#4a5a78',
      '--band-intake-text': '#1a4fa3',
      '--band-fulfillment-text': '#0f766e',
      '--row-stripe': '#f2f6fc',
      '--shadow-card': '0 1px 2px rgba(19,35,69,0.06), 0 4px 12px -6px rgba(19,35,69,0.10)',
      '--shadow-card-hover':
        '0 2px 4px rgba(19,35,69,0.08), 0 12px 24px -10px rgba(19,35,69,0.18)',
      '--ok': '#12855c',
      '--ok-soft': '#e3f5ed',
      '--danger': '#d33a3a',
      '--danger-soft': '#fdeaea',
      '--chip-bg': '#eef2f9',
      '--chip-text': '#41506b',
    },
  },
  {
    id: 'dark',
    label: 'Corporate dark',
    description: 'Corporate dark — navy-black surfaces, same layout and accents',
    vars: {
      '--bg': '#0b1220',
      '--bg-accent-1': 'rgba(59,130,246,0.10)',
      '--bg-accent-2': 'rgba(148,163,184,0.05)',
      '--surface': '#151f33',
      '--surface-muted': '#121a2b',
      '--surface-raised': '#18243a',
      '--border': '#26334c',
      '--border-strong': '#3d5176',
      '--text': '#e9eefa',
      '--text-muted': '#a3b0c8',
      '--text-subtle': '#75839c',
      '--accent': '#6ba4ff',
      '--accent-soft': 'rgba(107,164,255,0.16)',
      '--header-bg': '#101a2e',
      '--header-text': '#ffffff',
      '--header-muted': 'rgba(214,226,248,0.6)',
      '--header-border': 'rgba(255,255,255,0.10)',
      '--header-control': 'rgba(255,255,255,0.06)',
      '--header-control-active': 'rgba(107,164,255,0.24)',
      '--col-header-bg': '#1b2a45',
      '--col-header-text': '#dce7fb',
      '--grid-dot': 'rgba(255,255,255,0.05)',
      '--edge': '#5c6d8c',
      '--edge-active': '#6ba4ff',
      '--band-request': 'rgba(148,163,184,0.05)',
      '--band-intake': 'rgba(107,164,255,0.08)',
      '--band-fulfillment': 'rgba(45,212,191,0.06)',
      '--band-request-text': '#a3b0c8',
      '--band-intake-text': '#9dc0ff',
      '--band-fulfillment-text': '#6fd6c6',
      '--row-stripe': 'rgba(255,255,255,0.025)',
      '--shadow-card': '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.7)',
      '--shadow-card-hover':
        '0 2px 4px rgba(0,0,0,0.45), 0 16px 36px -14px rgba(0,0,0,0.8)',
      '--ok': '#34d399',
      '--ok-soft': 'rgba(52,211,153,0.14)',
      '--danger': '#f87171',
      '--danger-soft': 'rgba(248,113,113,0.14)',
      '--chip-bg': 'rgba(255,255,255,0.06)',
      '--chip-text': '#c3cad6',
    },
  },
  {
    id: 'slate',
    label: 'Slate blue',
    description: 'Slate blue — mid navy canvas with the same corporate structure',
    vars: {
      '--bg': '#1e2f52',
      '--bg-accent-1': 'rgba(96,165,250,0.12)',
      '--bg-accent-2': 'rgba(56,189,248,0.07)',
      '--surface': '#2c4067',
      '--surface-muted': '#27395c',
      '--surface-raised': '#314772',
      '--border': '#3d5580',
      '--border-strong': '#6f8ab5',
      '--text': '#eef3fb',
      '--text-muted': '#adbcd6',
      '--text-subtle': '#8496b3',
      '--accent': '#7fb2ff',
      '--accent-soft': 'rgba(127,178,255,0.18)',
      '--header-bg': '#16294a',
      '--header-text': '#ffffff',
      '--header-muted': 'rgba(219,231,250,0.66)',
      '--header-border': 'rgba(255,255,255,0.12)',
      '--header-control': 'rgba(255,255,255,0.08)',
      '--header-control-active': 'rgba(127,178,255,0.28)',
      '--col-header-bg': '#24406f',
      '--col-header-text': '#e4edfb',
      '--grid-dot': 'rgba(226,232,240,0.07)',
      '--edge': '#7d90b3',
      '--edge-active': '#8fd0f5',
      '--band-request': 'rgba(226,232,240,0.05)',
      '--band-intake': 'rgba(127,178,255,0.12)',
      '--band-fulfillment': 'rgba(56,189,248,0.10)',
      '--band-request-text': '#adbcd6',
      '--band-intake-text': '#aecdff',
      '--band-fulfillment-text': '#8ad9f0',
      '--row-stripe': 'rgba(226,232,240,0.035)',
      '--shadow-card': '0 1px 2px rgba(8,15,26,0.45), 0 10px 26px -14px rgba(8,15,26,0.75)',
      '--shadow-card-hover':
        '0 2px 5px rgba(8,15,26,0.5), 0 18px 38px -16px rgba(8,15,26,0.85)',
      '--ok': '#34d399',
      '--ok-soft': 'rgba(52,211,153,0.16)',
      '--danger': '#fb7185',
      '--danger-soft': 'rgba(251,113,133,0.16)',
      '--chip-bg': 'rgba(226,232,240,0.08)',
      '--chip-text': '#cbd5e1',
    },
  },
];

export const DEFAULT_THEME: ThemeId = 'light';

/**
 * Resolved token value. SVG presentation attributes are exported as literal
 * colours so image exports keep the same palette as the canvas.
 */
export function themeVar(id: ThemeId, token: string) {
  const theme = THEMES.find((candidate) => candidate.id === id) ?? THEMES[0];
  return theme.vars[token] ?? '';
}

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((candidate) => candidate.id === id) ?? THEMES[0];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
  root.dataset.theme = theme.id;
  root.classList.toggle('dark', theme.id !== 'light');
}
