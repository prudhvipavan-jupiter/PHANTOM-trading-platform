import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';
import LoadingState from './common/LoadingState';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string; // ISO string
  sentiment: 'positive' | 'negative' | 'neutral';
  impactScore: number;
  ticker?: string;
}

interface SocialSentiment {
  ticker: string;
  mentions: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

interface TradingOpportunity {
  symbol: string;
  reason: string;
  targetPrice: string;
  accuracy: string;
}

interface DailyTradingOpportunitiesProps {
  news: NewsItem[];
  socialSentiment: SocialSentiment[];
  loadingNews: boolean;
  loadingSocial: boolean;
}

const getDailyTradingOpportunities = (news: NewsItem[], socialSentiment: SocialSentiment[]): TradingOpportunity[] => {
  const opportunities: TradingOpportunity[] = [];

  // Prioritize positive news with high impact
  news.filter(n => n.sentiment === 'positive' && n.impactScore >= 80 && n.ticker)
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 2)
      .forEach(item => {
        opportunities.push({
          symbol: item.ticker!,
          reason: `High impact positive news: "${item.headline.substring(0, 50)}..."`,
          targetPrice: (Math.random() * (100 - 1) + 1).toFixed(2), // Mock target price
          accuracy: (90 + Math.random() * 5).toFixed(0), // Simulate 90-95% accuracy
        });
      });

  // Add from social sentiment if still space and strong positive sentiment
  if (opportunities.length < 3) {
    socialSentiment.filter(s => s.sentimentBreakdown.positive > 50)
                   .sort((a, b) => b.sentimentBreakdown.positive - a.sentimentBreakdown.positive)
                   .slice(0, 3 - opportunities.length)
                   .forEach(item => {
                     opportunities.push({
                       symbol: item.ticker,
                       reason: `Strong positive social sentiment (${item.mentions} mentions)`,
                       targetPrice: (Math.random() * (100 - 1) + 1).toFixed(2), // Mock target price
                       accuracy: (85 + Math.random() * 5).toFixed(0), // Simulate 85-90% accuracy
                     });
                   });
  }

  return opportunities;
};

const DailyTradingOpportunities: React.FC<DailyTradingOpportunitiesProps> = ({
  news,
  socialSentiment,
  loadingNews,
  loadingSocial,
}) => {
  return (
    <motion.div
      className="phantom-card p-6 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2 flex items-center">
        <FontAwesomeIcon icon={faRobot} className="mr-3 text-phantom-blue" />
        AI-Curated Daily Trading Opportunities
      </h2>
      {loadingNews || loadingSocial ? (
        <LoadingState type="spinner" text="Loading trading opportunities..." />
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 mb-4">
            Based on real-time news sentiment and social media analytics, PHANTOM's AI identifies high-probability trading setups. <span className="font-bold text-red-400">Disclaimer: These are simulated recommendations based on mock data. Actual accuracy depends on live market conditions and advanced AI models.</span>
          </p>
          {getDailyTradingOpportunities(news, socialSentiment).length === 0 ? (
            <p className="text-gray-500 text-center py-4">No trading opportunities identified for today.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getDailyTradingOpportunities(news, socialSentiment).map((opportunity, index) => (
                <motion.div
                  key={index}
                  className="phantom-card-item p-4 rounded-lg border border-[#3a3a3a] flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div>
                    <h3 className="font-bold text-xl mb-2 text-phantom-blue">{opportunity.symbol}</h3>
                    <p className="text-sm text-gray-300 mb-2">Reason: {opportunity.reason}</p>
                    <p className="text-sm text-gray-300">Target Price: <span className="font-semibold text-white">{opportunity.targetPrice}</span></p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#3a3a3a] flex justify-between items-center">
                    <span className="text-sm text-gray-400">Simulated Accuracy:</span>
                    <span className="font-bold text-lg text-green-400">{opportunity.accuracy}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DailyTradingOpportunities; 