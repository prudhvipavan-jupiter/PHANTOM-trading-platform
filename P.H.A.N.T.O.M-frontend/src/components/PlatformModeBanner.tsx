import { APP_MODE, USE_MOCK_API } from '../config/env';
import { getApiMode } from '../utils/api';

const modeLabels: Record<string, { label: string; color: string }> = {
  demo: { label: 'Demo mode — simulated data for UI testing', color: 'bg-amber-500/20 text-amber-200 border-amber-500/40' },
  paper: { label: 'Paper trading — no real money at risk', color: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40' },
  live: { label: 'Live mode — real capital at risk', color: 'bg-red-500/20 text-red-200 border-red-500/40' },
};

export default function PlatformModeBanner() {
  const apiMode = getApiMode();
  const mode = modeLabels[APP_MODE] || modeLabels.paper;

  return (
    <div className={`border-b px-4 py-2 text-center text-xs sm:text-sm ${mode.color}`}>
      <span className="font-medium">{mode.label}</span>
      <span className="mx-2 opacity-60">|</span>
      <span>API: {apiMode === 'mock' ? 'Simulated (Vercel/demo)' : 'Backend connected'}</span>
      <span className="mx-2 opacity-60">|</span>
      <span className="opacity-90">
        Trading involves risk. Past performance does not guarantee future results.
      </span>
    </div>
  );
}
