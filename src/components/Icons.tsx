const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const HelpIcon = () => (
    <svg {...base} aria-hidden><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.6v.3" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></svg>
);
export const StatsIcon = () => (
    <svg {...base} aria-hidden><path d="M5 20V11M12 20V4M19 20v-6" /></svg>
);
export const MoonIcon = () => (
    <svg {...base} aria-hidden><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
);
export const SunIcon = () => (
    <svg {...base} aria-hidden><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const CloseIcon = () => (
    <svg {...base} aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
);
