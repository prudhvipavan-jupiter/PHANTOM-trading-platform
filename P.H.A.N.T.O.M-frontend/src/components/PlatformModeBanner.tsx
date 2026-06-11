import { APP_MODE } from '../config/env';

const modeLabels: Record<string, { label: string; color: string }> = {
  demo: { label: 'Paper trading — live Yahoo prices, virtual money', color: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' },
  paper: { label: 'Paper trading — live market data, no real money', color: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' },
  live: { label: 'Live mode — real capital at risk', color: 'bg-red-500/20 text-red-200 border-red-500/40' },
};

export default function PlatformModeBanner() {
  const mode = modeLabels[APP_MODE] || modeLabels.paper;

  return (
    <div className={`border-b px-4 py-2 text-center text-xs sm:text-sm ${mode.color}`}>
      <span className="font-medium">{mode.label}</span>
      <span className="mx-2 opacity-60">|</span>
      <span>Market data: Yahoo Finance (live)</span>
      <span className="mx-2 opacity-60">|</span>
      <span className="opacity-90">
        Trading involves risk. Past performance does not guarantee future results.
      </span>
    </div>
  );
}
