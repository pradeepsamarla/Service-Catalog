import { motion } from 'framer-motion';
import { Download, Moon, Sun } from 'lucide-react';

type TitleBarProps = {
  title: string;
  parentService: string;
  dark: boolean;
  onToggleTheme: () => void;
};

export function TitleBar({ title, parentService, dark, onToggleTheme }: TitleBarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 px-8 pt-7"
    >
      <div>
        <h1 className="bg-gradient-to-r from-white via-violet-100 to-teal-200 bg-clip-text text-[28px] font-semibold leading-tight tracking-tight text-transparent">
          {title}
        </h1>
        <p className="mt-1.5 text-[12.5px] uppercase tracking-[0.28em] text-slate-400">
          Parent service · {parentService}
        </p>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-hairline bg-glass px-3.5 py-2 text-[12px] font-medium text-slate-200 backdrop-blur-[18px] shadow-glow transition hover:text-white hover:shadow-glow-strong"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          Export
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="flex items-center justify-center rounded-xl border border-hairline bg-glass p-2.5 text-slate-200 backdrop-blur-[18px] shadow-glow transition hover:text-white hover:shadow-glow-strong"
        >
          {dark ? (
            <Sun className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Moon className="h-4 w-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </motion.header>
  );
}
