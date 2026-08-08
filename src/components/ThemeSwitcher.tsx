import { Moon, Sun, Waves } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { THEMES, type ThemeId } from '../theme/themes';

const ICONS = { dark: Moon, light: Sun, slate: Waves } as const;

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-0.5 rounded-md p-0.5"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
    >
      {THEMES.map((entry) => {
        const Icon = ICONS[entry.id as ThemeId];
        const active = theme === entry.id;
        return (
          <button
            key={entry.id}
            type="button"
            title={entry.description}
            aria-label={entry.label}
            aria-pressed={active}
            onClick={() => setTheme(entry.id)}
            className="flex h-7 w-7 items-center justify-center rounded"
            style={{
              background: active ? 'var(--accent-soft)' : 'transparent',
              color: active ? 'var(--accent)' : 'var(--text-subtle)',
            }}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
