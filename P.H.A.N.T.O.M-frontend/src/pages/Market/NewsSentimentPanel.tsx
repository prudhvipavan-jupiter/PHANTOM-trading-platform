import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faChartLine, faRobot, faTimes, faChevronDown, faChevronUp, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useToast } from '../../contexts/ToastContext';
import { useVoice } from '../../contexts/VoiceContext';
import Chart from 'react-apexcharts';
import LoadingState from '../../components/common/LoadingState';
import { newsAI } from '../../services/newsAI';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, Scatter } from 'recharts';

// Interfaces for data
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

const NewsSentimentPanel: React.FC = () => {
  const { showToast } = useToast();
  const { irisSpeak } = useVoice(); // IRIS integration
  const [news, setNews] = useState<NewsItem[]>([]);
  const [socialSentiment, setSocialSentiment] = useState<SocialSentiment[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingSocial, setLoadingSocial] = useState(true);
  const [tickerFilter, setTickerFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'positive' | 'negative' | 'neutral' | ''>( '');
  const [sourceFilter, setSourceFilter] = useState('');
  const [expandedNewsId, setExpandedNewsId] = useState<string | null>(null);
  const [timelineTicker, setTimelineTicker] = useState('');
  const [timelineView, setTimelineView] = useState<'news' | 'combined'>('news');
  const [timelineData] = useState([]);
  const [socialTickerFilter, setSocialTickerFilter] = useState('');
  const [socialTimeRange, setSocialTimeRange] = useState('1h');

  const sentimentOptions = [
    { value: '', label: 'All Sentiments' },
    { value: 'positive', label: 'Positive' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'negative', label: 'Negative' },
  ];

  const fetchAllData = useCallback(async () => {
    setLoadingNews(true);
    setLoadingSocial(true);
    try {
      const newsData = await newsAI.fetchNews({ ticker: tickerFilter, sentiment: sentimentFilter, source: sourceFilter });
      setNews(newsData);
      const socialData = await newsAI.fetchSocialSentiment();
      setSocialSentiment(socialData);
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to fetch data.' });
      console.error('Error fetching data:', error);
    } finally {
      setLoadingNews(false);
      setLoadingSocial(false);
    }
  }, [tickerFilter, sentimentFilter, sourceFilter, showToast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSummarizeNews = useCallback(() => {
    if (news.length === 0) {
      irisSpeak("There is no news to summarize at the moment.");
      return;
    }
    const top3News = news
      .sort((a: NewsItem, b: NewsItem) => b.impactScore - a.impactScore) // Sort by impact score
      .slice(0, 3)
      .map(item => `Headline: ${item.headline}. Sentiment: ${item.sentiment}. Source: ${item.source}.`)
      .join(' ');
    irisSpeak(`Here are the top 3 impactful headlines: ${top3News}`);
    showToast({ type: 'info', title: 'IRIS Summary', message: 'IRIS is summarizing the top news.' });
  }, [news, irisSpeak, showToast]);

  const getSentimentTagColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      case 'neutral': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const socialSentimentChartOptions = useMemo(() => (ticker: string) => {
    const sentiment = socialSentiment.find(s => s.ticker === ticker)?.sentimentBreakdown;
    if (!sentiment) return {};

    return {
      chart: {
        type: 'donut' as 'donut', // Explicitly cast to 'donut'
        background: 'transparent',
        foreColor: '#f0b323',
      },
      labels: ['Positive', 'Negative', 'Neutral'],
      colors: ['#00f2ff', '#ff4500', '#f0b323'],
      dataLabels: { enabled: false },
      legend: { show: false },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w: any) {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };
  }, [socialSentiment]);

  const socialSentimentChartSeries = useMemo(() => (ticker: string) => {
    const sentiment = socialSentiment.find(s => s.ticker === ticker)?.sentimentBreakdown;
    if (!sentiment) return [];
    return [sentiment.positive, sentiment.negative, sentiment.neutral];
  }, [socialSentiment]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8 bg-[#1a1a1a] min-h-screen text-white font-orbitron"
    >
      <h1 className="phantom-title text-4xl mb-6 flex items-center">
        <FontAwesomeIcon icon={faNewspaper} className="mr-4 text-phantom-blue" />
        PHANTOM News Intelligence
      </h1>

      {/* Today's News Impact on Portfolio */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-3 text-phantom-blue" />
          Today's News Impact on Portfolio
        </h2>
        {loadingNews ? (
          <LoadingState type="spinner" text="Loading news..." />
        ) : (
          <div className="space-y-3">
            <p className="text-gray-300">
              Our AI detects significant news impacting your portfolio.
            </p>
            {news.filter(n => n.ticker && ['ZOMATO', 'RELIANCE', 'TCS', 'HDFCBANK', 'INFY'].includes(n.ticker))
                  .sort((a: NewsItem, b: NewsItem) => b.impactScore - a.impactScore)
                  .slice(0, 2).map((item) => (
              <p key={item.id} className="phantom-card-item p-3 rounded-md border border-[#3a3a3a] text-sm flex items-center justify-between">
                <span>
                  <FontAwesomeIcon icon={faRobot} className="mr-2 text-phantom-blue" />
                  AI Insight: <span className="font-semibold">{item.ticker} {item.sentiment === 'negative' ? 'down' : 'up'} after {item.sentiment} earnings report.</span> "{item.headline}"
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentTagColor(item.sentiment)}`}>
                  {item.sentiment.toUpperCase()}
                </span>
              </p>
            ))}
            <div className="flex justify-end mt-4">
              <Button onClick={handleSummarizeNews} className="phantom-button flex items-center">
                <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                Summarize Today's News (IRIS)
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* News Feed List */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2 flex items-center">
          <FontAwesomeIcon icon={faNewspaper} className="mr-3 text-phantom-blue" />
          Latest Market News
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <Input
            type="text"
            placeholder="Filter by Ticker (e.g., RELIANCE)"
            value={tickerFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTickerFilter(e.target.value)}
            className="phantom-input flex-1 min-w-[200px]"
          />
          <Select
            value={sentimentFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSentimentFilter(e.target.value as 'positive' | 'negative' | 'neutral' | '')}
            options={sentimentOptions}
            className="phantom-input min-w-[180px]"
          />
          <Input
            type="text"
            placeholder="Filter by Source"
            value={sourceFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSourceFilter(e.target.value)}
            className="phantom-input flex-1 min-w-[200px]"
          />
          <Button onClick={() => { setTickerFilter(''); setSentimentFilter(''); setSourceFilter(''); }} className="phantom-button">
            <FontAwesomeIcon icon={faTimes} className="mr-2" />Clear Filters
          </Button>
        </div>

        {loadingNews ? (
          <LoadingState type="spinner" text="Loading news..." />
        ) : (
          <div className="space-y-4">
            {news.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No news found for your filters.</p>
            ) : (
              news.map(item => (
                <motion.div
                  key={item.id}
                  className="phantom-card-item p-4 rounded-lg border border-[#3a3a3a] cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setExpandedNewsId(expandedNewsId === item.id ? null : item.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-white pr-4">{item.headline}</h3>
                    <FontAwesomeIcon
                      icon={expandedNewsId === item.id ? faChevronUp : faChevronDown}
                      className="text-phantom-blue transition-transform duration-200"
                    />
                  </div>
                  {expandedNewsId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-2 text-sm text-gray-300"
                    >
                      <p><span className="font-medium text-phantom-blue">Source:</span> {item.source}</p>
                      <p><span className="font-medium text-phantom-blue">Time:</span> {new Date(item.timestamp).toLocaleString()}</p>
                      <p>
                        <span className="font-medium text-phantom-blue">Sentiment:</span>{' '}
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSentimentTagColor(item.sentiment)}`}>
                          {item.sentiment.toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-phantom-blue">Impact Score:</span>{' '}
                        <span className={`font-bold ${getImpactScoreColor(item.impactScore)}`}>{item.impactScore}</span> / 100
                      </p>
                      {item.ticker && (
                        <p><span className="font-medium text-phantom-blue">Ticker:</span> {item.ticker}</p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Social Media Sentiment Panel */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-3 text-phantom-blue" />
          Social Media Sentiment
        </h2>
        {loadingSocial ? (
          <LoadingState type="spinner" text="Loading social sentiment..." />
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <Input
                type="text"
                placeholder="Search by ticker..."
                value={socialTickerFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocialTickerFilter(e.target.value)}
                className="phantom-input flex-1 min-w-[200px]"
              />
              <Select
                value={socialTimeRange}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSocialTimeRange(e.target.value)}
                options={[
                  { value: '1h', label: 'Last Hour' },
                  { value: '24h', label: 'Last 24 Hours' },
                  { value: '7d', label: 'Last 7 Days' },
                  { value: '30d', label: 'Last 30 Days' }
                ]}
                className="phantom-input min-w-[180px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialSentiment.length === 0 ? (
                <p className="text-gray-500 text-center py-8 col-span-full">No social sentiment data available.</p>
              ) : (
                socialSentiment
                  .filter(item => !socialTickerFilter || item.ticker.toLowerCase().includes(socialTickerFilter.toLowerCase()))
                  .map(item => (
                    <motion.div
                      key={item.ticker}
                      className="phantom-card-item p-4 rounded-lg border border-[#3a3a3a]"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-xl text-phantom-blue">{item.ticker}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Mentions:</span>
                          <span className="font-semibold text-white">{item.mentions}</span>
                        </div>
                      </div>

                      <div className="w-full h-[200px] mb-4">
                        <Chart
                          options={{
                            ...socialSentimentChartOptions(item.ticker),
                            chart: {
                              ...socialSentimentChartOptions(item.ticker).chart,
                              animations: {
                                enabled: true,
                                speed: 800,
                                animateGradually: {
                                  enabled: true,
                                  delay: 150
                                },
                                dynamicAnimation: {
                                  enabled: true,
                                  speed: 350
                                }
                              }
                            }
                          }}
                          series={socialSentimentChartSeries(item.ticker)}
                          type="donut"
                          width="100%"
                          height="100%"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Sentiment Score:</span>
                          <span className={`font-semibold ${getSentimentScoreColor(item)}`}>
                            {calculateSentimentScore(item)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Momentum:</span>
                          <span className={`font-semibold ${getMomentumColor(item)}`}>
                            {getMomentumIndicator(item)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Volume Trend:</span>
                          <span className={`font-semibold ${getVolumeTrendColor(item)}`}>
                            {getVolumeTrendIndicator(item)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#3a3a3a]">
                        <h4 className="text-sm font-semibold mb-2">Top Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {getTopKeywords(item).map((keyword, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-[#2a2a2a] rounded-full text-xs text-gray-300"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </div>
        )}
      </motion.div>

      {/* News Timeline Viewer */}
      <motion.div
        className="phantom-card p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="phantom-subtitle text-2xl mb-4 border-b border-[#3a3a3a] pb-2 flex items-center">
          <FontAwesomeIcon icon={faChartLine} className="mr-3 text-phantom-blue" />
          News Timeline View
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <Select
              value={timelineTicker}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimelineTicker(e.target.value)}
              options={[
                { value: '', label: 'All Tickers' },
                ...Array.from(new Set(news.filter((item): item is NewsItem & { ticker: string } => item.ticker !== undefined)
                                       .map(item => item.ticker)))
                     .map(ticker => ({
                       value: ticker,
                       label: ticker
                     }))
              ]}
              className="phantom-input min-w-[180px]"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setTimelineView('news')}
                className={`phantom-button ${timelineView === 'news' ? 'bg-phantom-blue' : ''}`}
              >
                News Only
              </Button>
              <Button
                onClick={() => setTimelineView('combined')}
                className={`phantom-button ${timelineView === 'combined' ? 'bg-phantom-blue' : ''}`}
              >
                News + Price
              </Button>
            </div>
          </div>
          
          <div className="relative h-[400px] bg-[#2a2a2a] rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={timelineData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
                <XAxis
                  dataKey="time"
                  stroke="#f0b323"
                  tick={{ fill: '#f0b323' }}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#00f2ff"
                  tick={{ fill: '#00f2ff' }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ff4500"
                  tick={{ fill: '#ff4500' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #3a3a3a',
                    color: '#fff'
                  }}
                />
                <Legend />
                {timelineView === 'combined' && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="#00f2ff"
                    name="Price"
                    dot={false}
                  />
                )}
                <Scatter
                  yAxisId="right"
                  dataKey="impact"
                  fill="#f0b323"
                  name="News Impact"
                  shape="circle"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="phantom-card-item p-4 rounded-lg border border-[#3a3a3a]">
              <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>• Most impactful news: {getMostImpactfulNews(news)}</li>
                <li>• Sentiment trend: {getSentimentTrend(news)}</li>
                <li>• Correlation with price: {getPriceCorrelation()}</li>
              </ul>
            </div>
            <div className="phantom-card-item p-4 rounded-lg border border-[#3a3a3a]">
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-300">
                {getAIAnalysis()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI-Curated Daily Trading Opportunities */}
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
    </motion.div>
  );
};

// Helper functions for timeline analysis
const getMostImpactfulNews = (news: NewsItem[]) => {
  const mostImpactful = news.sort((a: NewsItem, b: NewsItem) => b.impactScore - a.impactScore)[0];
  return mostImpactful ? `${mostImpactful.headline} (Impact: ${mostImpactful.impactScore})` : 'No news available';
};

const getSentimentTrend = (news: NewsItem[]) => {
  const sentiments = news.map((n: NewsItem) => n.sentiment);
  const positive = sentiments.filter((s: NewsItem['sentiment']) => s === 'positive').length;
  const negative = sentiments.filter((s: NewsItem['sentiment']) => s === 'negative').length;
  const neutral = sentiments.filter((s: NewsItem['sentiment']) => s === 'neutral').length;
  
  if (positive > negative && positive > neutral) return 'Positive trend';
  if (negative > positive && negative > neutral) return 'Negative trend';
  return 'Neutral trend';
};

const getPriceCorrelation = () => {
  // This would be calculated based on actual price data
  return 'Moderate positive correlation (0.65)';
};

const getAIAnalysis = () => {
  return 'Based on recent news patterns and market sentiment, our AI suggests a cautiously optimistic outlook. The high impact news items indicate significant market-moving events, while social sentiment shows growing positive momentum.';
};

// Add these helper functions at the bottom of the file
const calculateSentimentScore = (item: SocialSentiment) => {
  const { positive, negative, neutral } = item.sentimentBreakdown;
  return Math.round((positive - negative + neutral * 0.5) * 100 / (positive + negative + neutral));
};

const getSentimentScoreColor = (item: SocialSentiment) => {
  const score = calculateSentimentScore(item);
  if (score >= 60) return 'text-green-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

const getMomentumIndicator = (_item: SocialSentiment) => {
  return '📈';
};

const getMomentumColor = (_item: SocialSentiment) => {
  return 'text-green-500';
};

const getVolumeTrendIndicator = (_item: SocialSentiment) => {
  return '📊';
};

const getVolumeTrendColor = (_item: SocialSentiment) => {
  return 'text-blue-500';
};

const getTopKeywords = (_item: SocialSentiment) => {
  return ['AI', 'Trading', 'Profit'];
};

// Add new helper function for daily trading opportunities
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

export default NewsSentimentPanel;