export type ThemeId = 'dark' | 'light' | 'slate';

export type Theme = {
  id: ThemeId;
  label: string;
  description: string;
  vars: Record<string, string>;
};

export const THEMES: Theme[] = [
  {
    id: 'dark',
    label: 'Graphite dark',
    description: 'Enterprise dark — graphite surfaces, restrained accents',
    vars: {
      '--bg': '#0f1115',
      '--bg-accent-1': 'rgba(59,130,246,0.10)',
      '--bg-accent-2': 'rgba(148,163,184,0.06)',
      '--surface': 'rgba(24,27,33,0.92)',
      '--surface-muted': 'rgba(24,27,33,0.55)',
      '--surface-raised': 'rgba(30,34,42,0.96)',
      '--border': 'rgba(255,255,255,0.09)',
      '--border-strong': 'rgba(255,255,255,0.18)',
      '--text': '#e8eaee',
      '--text-muted': '#9aa3b2',
      '--text-subtle': '#6b7484',
      '--accent': '#4f8dfb',
      '--accent-soft': 'rgba(79,141,251,0.16)',
      '--grid-dot': 'rgba(255,255,255,0.05)',
      '--edge': 'rgba(154,163,178,0.55)',
      '--edge-active': '#4f8dfb',
      '--band-request': 'rgba(148,163,184,0.05)',
      '--band-intake': 'rgba(79,141,251,0.07)',
      '--band-fulfillment': 'rgba(45,212,191,0.06)',
      '--band-request-text': '#9aa3b2',
      '--band-intake-text': '#8fb6fd',
      '--band-fulfillment-text': '#6fd6c6',
      '--row-stripe': 'rgba(255,255,255,0.022)',
      '--shadow-card': '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.7)',
      '--shadow-card-hover':
        '0 2px 4px rgba(0,0,0,0.45), 0 16px 36px -14px rgba(0,0,0,0.8)',
      '--ok': '#34d399',
      '--ok-soft': 'rgba(52,211,153,0.14)',
      '--danger': '#f87171',
      '--danger-soft': 'rgba(248,113,113,0.14)',
      '--chip-bg': 'rgba(255,255,255,0.055)',
      '--chip-text': '#c3cad6',
    },
  },
  {
    id: 'light',
    label: 'Enterprise light',
    description: 'Clean light — white cards, neutral greys, blue accent',
    vars: {
      '--bg': '#f4f6fa',
      '--bg-accent-1': 'rgba(59,130,246,0.08)',
      '--bg-accent-2': 'rgba(15,23,42,0.03)',
      '--surface': '#ffffff',
      '--surface-muted': 'rgba(255,255,255,0.65)',
      '--surface-raised': '#ffffff',
      '--border': 'rgba(15,23,42,0.10)',
      '--border-strong': 'rgba(15,23,42,0.22)',
      '--text': '#111826',
      '--text-muted': '#5b6577',
      '--text-subtle': '#8a94a6',
      '--accent': '#2563eb',
      '--accent-soft': 'rgba(37,99,235,0.10)',
      '--grid-dot': 'rgba(15,23,42,0.07)',
      '--edge': 'rgba(100,116,139,0.6)',
      '--edge-active': '#2563eb',
      '--band-request': 'rgba(15,23,42,0.035)',
      '--band-intake': 'rgba(37,99,235,0.06)',
      '--band-fulfillment': 'rgba(13,148,136,0.06)',
      '--band-request-text': '#5b6577',
      '--band-intake-text': '#1d4ed8',
      '--band-fulfillment-text': '#0f766e',
      '--row-stripe': 'rgba(15,23,42,0.022)',
      '--shadow-card': '0 1px 2px rgba(16,24,40,0.06), 0 6px 16px -8px rgba(16,24,40,0.12)',
      '--shadow-card-hover':
        '0 2px 4px rgba(16,24,40,0.08), 0 14px 28px -10px rgba(16,24,40,0.2)',
      '--ok': '#059669',
      '--ok-soft': 'rgba(5,150,105,0.10)',
      '--danger': '#dc2626',
      '--danger-soft': 'rgba(220,38,38,0.09)',
      '--chip-bg': 'rgba(15,23,42,0.045)',
      '--chip-text': '#41495a',
    },
  },
  {
    id: 'slate',
    label: 'Slate blue',
    description: 'Mid-tone navy — dashboard style with blue-grey surfaces',
    vars: {
      '--bg': '#243352',
      '--bg-accent-1': 'rgba(96,165,250,0.14)',
      '--bg-accent-2': 'rgba(56,189,248,0.08)',
      '--surface': 'rgba(52,70,104,0.94)',
      '--surface-muted': 'rgba(52,70,104,0.6)',
      '--surface-raised': 'rgba(60,80,118,0.96)',
      '--border': 'rgba(203,213,225,0.14)',
      '--border-strong': 'rgba(203,213,225,0.28)',
      '--text': '#eef2f8',
      '--text-muted': '#a8b6cc',
      '--text-subtle': '#7d8ca6',
      '--accent': '#60a5fa',
      '--accent-soft': 'rgba(96,165,250,0.18)',
      '--grid-dot': 'rgba(226,232,240,0.07)',
      '--edge': 'rgba(168,182,204,0.6)',
      '--edge-active': '#7dd3fc',
      '--band-request': 'rgba(226,232,240,0.06)',
      '--band-intake': 'rgba(96,165,250,0.13)',
      '--band-fulfillment': 'rgba(56,189,248,0.11)',
      '--band-request-text': '#a8b6cc',
      '--band-intake-text': '#a5c8ff',
      '--band-fulfillment-text': '#8ad9f0',
      '--row-stripe': 'rgba(226,232,240,0.03)',
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

export const DEFAULT_THEME: ThemeId = 'slate';

export function applyTheme(id: ThemeId) {
  const theme = THEMES.find((candidate) => candidate.id === id) ?? THEMES[0];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
  root.dataset.theme = theme.id;
  root.classList.toggle('dark', theme.id !== 'light');
}
