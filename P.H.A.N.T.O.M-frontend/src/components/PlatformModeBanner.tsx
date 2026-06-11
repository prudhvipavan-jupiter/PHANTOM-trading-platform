import { useAuth } from '../contexts/AuthContext';
import { isVercelHost } from '../utils/deploy';

export default function PlatformModeBanner() {
  const { isLocalMode } = useAuth();
  const onVercel = isVercelHost();

  if (onVercel && isLocalMode) {
    return (
      <div className="border-b px-4 py-2 text-center text-xs sm:text-sm bg-cyan-500/20 text-cyan-200 border-cyan-500/40">
        Vercel — paper trading with live NSE/BSE prices (virtual money). Live Paytm: run app on your PC.
      </div>
    );
  }

  if (isLocalMode) {
    return (
      <div className="border-b px-4 py-2 text-center text-xs sm:text-sm bg-cyan-500/20 text-cyan-200 border-cyan-500/40">
        Paper mode — virtual money saved in this browser.
      </div>
    );
  }

  return (
    <div className="border-b px-4 py-2 text-center text-xs sm:text-sm bg-red-500/20 text-red-200 border-red-500/40">
      Live trading — real Paytm Money orders. Capital at risk.
    </div>
  );
}
