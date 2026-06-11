import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/authenticate.js';
import { logger } from '../utils/logger.js';
import {
  getLoginUrl,
  exchangeRequestToken,
  placeRegularOrder,
  getOrderBook,
  getFundsSummary,
  getHoldings,
  getUserDetails,
  logoutSession,
  resolveSecurityId,
  getPaytmBrokerAccount,
  getPaytmTokens,
} from '../services/paytmMoneyService.js';

const router = express.Router();

function paytmCredentials(user) {
  const envKey = process.env.PAYTM_MONEY_API_KEY;
  const envSecret = process.env.PAYTM_MONEY_API_SECRET;
  const account = user.brokerAccounts?.find((b) => b.broker === 'paytm_money');

  const apiKey = account?.apiKey || envKey;
  const apiSecret = account?.apiSecret || envSecret;

  if (!apiKey || !apiSecret) {
    throw new Error('Paytm API key/secret missing. Add PAYTM_MONEY_API_KEY and PAYTM_MONEY_API_SECRET to .env or Settings.');
  }

  return { apiKey, apiSecret };
}

router.get('/list', authenticate, async (req, res) => {
  try {
    const paytmConnected = Boolean(getPaytmBrokerAccount(req.user));
    res.json({
      success: true,
      data: [
        {
          id: 'paytm_money',
          name: 'Paytm Money',
          features: ['Equity', 'Live orders', 'Holdings', 'Funds'],
          brokerage: 'Per Paytm schedule',
          isConnected: paytmConnected,
        },
      ],
    });
  } catch (error) {
    logger.error('brokers list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch brokers' });
  }
});

router.get('/paytm/status', authenticate, async (req, res) => {
  try {
    const account = getPaytmBrokerAccount(req.user);
    const tokens = getPaytmTokens(req.user);
    if (!account || !tokens) {
      return res.json({
        success: true,
        data: { connected: false, message: 'Paytm Money not linked' },
      });
    }

    const details = await getUserDetails(tokens);
    res.json({
      success: true,
      data: {
        connected: true,
        accountId: account.accountId,
        lastSync: account.lastSync,
        user: details?.data || details,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.post('/paytm/configure', authenticate, async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;
    if (!apiKey || !apiSecret) {
      return res.status(400).json({ success: false, error: 'apiKey and apiSecret required' });
    }

    let account = req.user.brokerAccounts.find((b) => b.broker === 'paytm_money');
    if (!account) {
      req.user.brokerAccounts.push({
        broker: 'paytm_money',
        apiKey,
        apiSecret,
        isActive: false,
      });
    } else {
      account.apiKey = apiKey;
      account.apiSecret = apiSecret;
    }

    await req.user.save();
    res.json({ success: true, message: 'Paytm API credentials saved on this server' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/paytm/login-url', authenticate, async (req, res) => {
  try {
    const { apiKey } = paytmCredentials(req.user);
    const loginUrl = getLoginUrl(apiKey, String(req.user._id));
    res.json({ success: true, data: { loginUrl } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/paytm/callback', async (req, res) => {
  try {
    const requestToken = req.query.request_token || req.query.requestToken;
    const state = req.query.state;

    if (!requestToken || !state) {
      return res.status(400).send('Missing request_token or state from Paytm Money');
    }

    const user = await User.findById(state);
    if (!user) {
      return res.status(400).send('Invalid session state — log in to P.H.A.N.T.O.M again');
    }

    const { apiKey, apiSecret } = paytmCredentials(user);
    const tokens = await exchangeRequestToken(apiKey, apiSecret, requestToken);

    let account = user.brokerAccounts.find((b) => b.broker === 'paytm_money');
    if (!account) {
      account = { broker: 'paytm_money', apiKey, apiSecret, isActive: true };
      user.brokerAccounts.push(account);
    }

    account.accessToken = tokens.accessToken;
    account.publicAccessToken = tokens.publicAccessToken;
    account.readAccessToken = tokens.readAccessToken;
    account.isActive = true;
    account.lastSync = new Date();

    try {
      const details = await getUserDetails(tokens);
      const profile = details?.data || details;
      account.accountId = profile?.user_id || profile?.client_id || 'paytm_linked';
    } catch {
      account.accountId = 'paytm_linked';
    }

    await user.save();

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5000';
    res.redirect(`${frontend}/live-trading?paytm=connected`);
  } catch (error) {
    logger.error('Paytm callback error:', error);
    res.status(500).send(`Paytm link failed: ${error.message}`);
  }
});

router.post('/paytm/order', authenticate, async (req, res) => {
  try {
    const tokens = getPaytmTokens(req.user);
    if (!tokens) {
      return res.status(400).json({ success: false, error: 'Connect Paytm Money before placing live orders' });
    }

    const {
      symbol,
      tradeType,
      quantity,
      exchange = 'NSE',
      orderType = 'MKT',
      price = 0,
      product = 'C',
      confirmLive = false,
    } = req.body;

    if (!confirmLive) {
      return res.status(400).json({
        success: false,
        error: 'Live order blocked — set confirmLive: true after reviewing order details',
      });
    }

    if (!symbol || !tradeType || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, error: 'symbol, tradeType, and quantity are required' });
    }

    const maxQty = Number(process.env.MAX_LIVE_ORDER_QTY || 1000);
    if (quantity > maxQty) {
      return res.status(400).json({ success: false, error: `Quantity exceeds safety limit (${maxQty})` });
    }

    const txnType = tradeType === 'BUY' ? 'B' : 'S';
    const securityId = req.body.securityId || await resolveSecurityId(symbol, exchange);

    const result = await placeRegularOrder(tokens, {
      txnType,
      exchange,
      securityId,
      quantity,
      orderType: orderType === 'LIMIT' ? 'LMT' : 'MKT',
      price,
      product,
    });

    logger.info(`LIVE Paytm order: ${tradeType} ${symbol} x${quantity} user=${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Live order sent to Paytm Money — check order book for fill status',
      data: result,
    });
  } catch (error) {
    logger.error('Paytm live order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/paytm/orders', authenticate, async (req, res) => {
  try {
    const tokens = getPaytmTokens(req.user);
    if (!tokens) return res.status(400).json({ success: false, error: 'Paytm not connected' });
    const data = await getOrderBook(tokens);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/paytm/funds', authenticate, async (req, res) => {
  try {
    const tokens = getPaytmTokens(req.user);
    if (!tokens) return res.status(400).json({ success: false, error: 'Paytm not connected' });
    const data = await getFundsSummary(tokens);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/paytm/holdings', authenticate, async (req, res) => {
  try {
    const tokens = getPaytmTokens(req.user);
    if (!tokens) return res.status(400).json({ success: false, error: 'Paytm not connected' });
    const data = await getHoldings(tokens);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/paytm/disconnect', authenticate, async (req, res) => {
  try {
    const tokens = getPaytmTokens(req.user);
    if (tokens) {
      try {
        await logoutSession(tokens);
      } catch {
        /* session may already be invalid */
      }
    }

    const account = req.user.brokerAccounts.find((b) => b.broker === 'paytm_money');
    if (account) {
      account.isActive = false;
      account.accessToken = undefined;
      account.publicAccessToken = undefined;
      account.readAccessToken = undefined;
    }
    await req.user.save();
    res.json({ success: true, message: 'Paytm Money disconnected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
