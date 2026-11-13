const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
type P = { className?: string }
export const Check = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s} strokeWidth={3.2}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
export const ArrowLeft = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M15 5l-7 7 7 7" /></svg>
export const ArrowRight = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M9 5l7 7-7 7" /></svg>
export const Swap = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" /></svg>
export const Flame = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2c1 3.5 5.5 6 5.5 11a5.5 5.5 0 01-11 0c0-2.4 1.3-4 2.5-5 .2 1.6.9 2.7 2 3.2C10.6 8.4 11 5 12 2z" /></svg>
export const Printer = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M7 9V3h10v6M7 18H4v-7a2 2 0 012-2h12a2 2 0 012 2v7h-3M7 14h10v7H7z" /></svg>
export const Drop = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" /></svg>
export const Clock = ({ className = 'size-4' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
export const Calendar = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
export const CheckCircle = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><circle cx="12" cy="12" r="8.5" /><path d="M8 12.3l2.7 2.7L16 9.5" /></svg>
export const Sparkle = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} {...s}><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /></svg>
export const Bolt = ({ className = 'size-5' }: P) => <svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13.5 2L4 13.5h6.5L9.5 22 20 9.5h-6.8z" /></svg>
