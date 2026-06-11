import { Link } from 'react-router-dom';

export default function TradingDisclaimer() {
  return (
    <footer className="mt-8 rounded-lg border border-gray-700 bg-gray-900/80 p-4 text-xs text-gray-400">
      <p className="font-semibold text-gray-300">Important disclaimer</p>
      <p className="mt-2 leading-relaxed">
        P.H.A.N.T.O.M is a trading platform <strong>prototype for testing and education</strong>.
        Signals, win rates, and returns shown in the UI are simulated unless connected to a live broker
        with verified data. <strong>No system can guarantee 99% or 100% trading accuracy.</strong>
        Do not invest money based on demo metrics alone.
      </p>
      <p className="mt-2">
        <Link to="/compliance" className="text-cyan-400 hover:underline">Compliance &amp; risk disclosure</Link>
      </p>
    </footer>
  );
}
