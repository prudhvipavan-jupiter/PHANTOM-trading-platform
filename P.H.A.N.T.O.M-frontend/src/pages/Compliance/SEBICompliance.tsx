import { useState } from 'react';

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  status: 'acknowledged' | 'pending';
}

const complianceItems: ComplianceItem[] = [
  {
    id: '1',
    title: 'Risk Disclosure',
    description: 'I understand that trading in securities involves risk and I may lose money. Past performance is not indicative of future results.',
    status: 'acknowledged',
  },
  {
    id: '2',
    title: 'Algorithmic Trading',
    description: 'I acknowledge that the system uses algorithmic trading strategies and I understand the associated risks and benefits.',
    status: 'acknowledged',
  },
  {
    id: '3',
    title: 'Market Hours',
    description: 'I understand that trading is only allowed during market hours (9:15 AM to 3:30 PM IST) on trading days.',
    status: 'acknowledged',
  },
  {
    id: '4',
    title: 'Margin Requirements',
    description: 'I understand the margin requirements and will maintain sufficient funds in my trading account.',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Stop Loss',
    description: 'I acknowledge that stop-loss orders are essential risk management tools and will be used appropriately.',
    status: 'pending',
  },
];

const SEBICompliance = () => {
  const [acknowledgedItems, setAcknowledgedItems] = useState<string[]>(
    complianceItems.filter((item) => item.status === 'acknowledged').map((item) => item.id)
  );

  const handleAcknowledge = (id: string) => {
    if (!acknowledgedItems.includes(id)) {
      setAcknowledgedItems([...acknowledgedItems, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-orbitron text-primary">SEBI Compliance</h1>
        <div className="text-sm text-text-secondary">
          Last Updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="phantom-card">
        <div className="mb-6">
          <h2 className="text-xl font-orbitron mb-2">Compliance Status</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-accent-success mr-2"></div>
              <span className="text-sm text-text-secondary">
                {acknowledgedItems.length} Acknowledged
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-accent-warning mr-2"></div>
              <span className="text-sm text-text-secondary">
                {complianceItems.length - acknowledgedItems.length} Pending
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {complianceItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${
                acknowledgedItems.includes(item.id)
                  ? 'border-accent-success bg-accent-success bg-opacity-5'
                  : 'border-border-light bg-bg-hover'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-text-secondary">{item.description}</p>
                </div>
                {!acknowledgedItems.includes(item.id) && (
                  <button
                    onClick={() => handleAcknowledge(item.id)}
                    className="phantom-button text-sm"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
              {acknowledgedItems.includes(item.id) && (
                <div className="mt-2 text-sm text-accent-success">
                  ✓ Acknowledged on {new Date().toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="phantom-card">
        <h2 className="text-xl font-orbitron mb-4">Important Information</h2>
        <div className="space-y-4 text-sm text-text-secondary">
          <p>
            P.H.A.N.T.O.M is designed to assist with trading decisions but does not guarantee profits.
            All trading decisions should be made after careful consideration of market conditions and
            personal risk tolerance.
          </p>
          <p>
            The system complies with SEBI regulations regarding algorithmic trading and risk management.
            Users are responsible for understanding and following all applicable trading rules and
            regulations.
          </p>
          <p>
            For any compliance-related queries, please contact our support team at
            compliance@phantom.ai
          </p>
        </div>
      </div>
    </div>
  );
};

export default SEBICompliance; 