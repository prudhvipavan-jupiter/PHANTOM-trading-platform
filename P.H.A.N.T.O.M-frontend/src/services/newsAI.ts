export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string; // ISO string
  sentiment: 'positive' | 'negative' | 'neutral';
  impactScore: number;
  ticker?: string;
}

export interface SocialSentiment {
  ticker: string;
  mentions: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export const newsAI = {
  fetchNews: async (filters: { ticker?: string; sentiment?: string; source?: string }): Promise<NewsItem[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const dummyNews: NewsItem[] = [
      { id: '1', headline: 'BREAKING: Zomato announces record profits, shares expected to surge!', source: 'Economic Times', timestamp: '2024-06-15T09:30:00Z', sentiment: 'positive', impactScore: 95, ticker: 'ZOMATO' },
      { id: '2', headline: 'Reliance Industries announces new green energy initiative', source: 'Bloomberg', timestamp: '2024-06-15T10:00:00Z', sentiment: 'positive', impactScore: 92, ticker: 'RELIANCE' },
      { id: '3', headline: 'TCS inks major digital transformation deal', source: 'Reuters', timestamp: '2024-06-15T10:45:00Z', sentiment: 'positive', impactScore: 78, ticker: 'TCS' },
      { id: '4', headline: 'HDFC Bank sees steady growth in Q1, beats estimates', source: 'Live Mint', timestamp: '2024-06-15T11:15:00Z', sentiment: 'positive', impactScore: 88, ticker: 'HDFCBANK' },
      { id: '5', headline: 'Infosys to expand cloud services portfolio', source: 'Business Standard', timestamp: '2024-06-15T12:00:00Z', sentiment: 'neutral', impactScore: 65, ticker: 'INFY' },
      { id: '6', headline: 'Global markets react to interest rate hike concerns', source: 'Wall Street Journal', timestamp: '2024-06-15T13:00:00Z', sentiment: 'negative', impactScore: 90 },
      { id: '7', headline: 'Adani Ports shares gain on strong cargo volumes', source: 'NDTV Profit', timestamp: '2024-06-15T13:45:00Z', sentiment: 'positive', impactScore: 80, ticker: 'ADANIPORTS' },
      { id: '8', headline: 'Axis Bank launches new digital banking platform', source: 'The Hindu BusinessLine', timestamp: '2024-06-15T14:30:00Z', sentiment: 'neutral', impactScore: 55, ticker: 'AXISBANK' },
      { id: '9', headline: 'New policy impacts auto sector, mixed reactions', source: 'Times of India', timestamp: '2024-06-15T15:00:00Z', sentiment: 'neutral', impactScore: 70 },
      { id: '10', headline: 'Tech Mahindra wins multi-year IT contract', source: 'Moneycontrol', timestamp: '2024-06-15T15:30:00Z', sentiment: 'positive', impactScore: 75, ticker: 'TECHM' },
    ];

    let filteredNews = dummyNews;
    if (filters.ticker) {
      filteredNews = filteredNews.filter(news => news.ticker?.toLowerCase() === filters.ticker?.toLowerCase());
    }
    if (filters.sentiment) {
      filteredNews = filteredNews.filter(news => news.sentiment === filters.sentiment);
    }
    if (filters.source !== undefined && filters.source !== null) {
      filteredNews = filteredNews.filter(news => news.source.toLowerCase().includes(filters.source!.toLowerCase()));
    }
    return filteredNews;
  },

  fetchSocialSentiment: async (): Promise<SocialSentiment[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const dummySocialSentiment: SocialSentiment[] = [
      { ticker: 'ZOMATO', mentions: 1200, sentimentBreakdown: { positive: 30, negative: 50, neutral: 20 } },
      { ticker: 'RELIANCE', mentions: 950, sentimentBreakdown: { positive: 60, negative: 10, neutral: 30 } },
      { ticker: 'TCS', mentions: 700, sentimentBreakdown: { positive: 45, negative: 20, neutral: 35 } },
      { ticker: 'INFY', mentions: 600, sentimentBreakdown: { positive: 50, negative: 15, neutral: 35 } },
      { ticker: 'SBIN', mentions: 400, sentimentBreakdown: { positive: 40, negative: 30, neutral: 30 } },
    ];
    return dummySocialSentiment;
  },
}; 