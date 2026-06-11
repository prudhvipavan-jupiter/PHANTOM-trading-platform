import axios from 'axios';
import { logger } from '../utils/logger.js';

const HOST = 'https://developer.paytmmoney.com';
const LOGIN_BASE = 'https://login.paytmmoney.com/merchant-login?apiKey=';

const securityIdCache = new Map();

async function pmRequest(path, { method = 'GET', body, accessToken, readToken, tokens = ['access_token'] } = {}) {
  const jwt =
    tokens.includes('read_access_token') && readToken ? readToken
    : accessToken;

  if (!jwt && tokens.length > 0) {
    throw new Error('Paytm Money session expired — connect your account again');
  }

  const headers = {
    'Content-Type': 'application/json',
    'openapi-client-src': 'phantom',
    ...(jwt ? { 'x-jwt-token': jwt } : {}),
  };

  const response = await axios({
    method,
    url: `${HOST}${path}`,
    headers,
    data: body,
    validateStatus: () => true,
  });

  const payload = typeof response.data === 'string' ? tryParse(response.data) : response.data;

  if (response.status >= 400) {
    const msg = payload?.meta?.message || payload?.message || JSON.stringify(payload);
    throw new Error(msg || `Paytm API error (${response.status})`);
  }

  return payload;
}

function tryParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export function getLoginUrl(apiKey, stateKey) {
  if (!apiKey) throw new Error('Paytm API key is required');
  if (!stateKey) throw new Error('state key is required');
  return `${LOGIN_BASE}${encodeURIComponent(apiKey)}&state=${encodeURIComponent(stateKey)}`;
}

export async function exchangeRequestToken(apiKey, apiSecret, requestToken) {
  const result = await pmRequest('/accounts/v2/gettoken', {
    method: 'POST',
    body: {
      api_key: apiKey,
      api_secret_key: apiSecret,
      request_token: requestToken,
    },
    tokens: [],
  });

  const data = result?.data || result;
  return {
    accessToken: data.access_token,
    publicAccessToken: data.public_access_token,
    readAccessToken: data.read_access_token,
  };
}

export async function placeRegularOrder(tokens, order) {
  const payload = {
    txn_type: order.txnType,
    source: order.source || 'W',
    exchange: order.exchange || 'NSE',
    segment: order.segment || 'E',
    product: order.product || 'C',
    security_id: order.securityId,
    quantity: order.quantity,
    validity: order.validity || 'DAY',
    order_type: order.orderType || 'MKT',
    price: order.price ?? 0,
    off_mkt_flag: order.offMktFlag ?? false,
  };

  if (order.triggerPrice) payload.trigger_price = order.triggerPrice;

  return pmRequest('/orders/v1/place/regular', {
    method: 'POST',
    body: payload,
    accessToken: tokens.accessToken,
  });
}

export async function getOrderBook(tokens) {
  return pmRequest('/orders/v1/order-book', {
    accessToken: tokens.accessToken,
    readToken: tokens.readAccessToken,
    tokens: ['access_token', 'read_access_token'],
  });
}

export async function getPositions(tokens) {
  return pmRequest('/orders/v1/position', {
    accessToken: tokens.accessToken,
    readToken: tokens.readAccessToken,
    tokens: ['access_token', 'read_access_token'],
  });
}

export async function getFundsSummary(tokens) {
  return pmRequest('/accounts/v1/funds/summary', {
    accessToken: tokens.accessToken,
    readToken: tokens.readAccessToken,
    tokens: ['access_token', 'read_access_token'],
  });
}

export async function getHoldings(tokens) {
  return pmRequest('/holdings/v1/get-user-holdings-data', {
    accessToken: tokens.accessToken,
    readToken: tokens.readAccessToken,
    tokens: ['access_token', 'read_access_token'],
  });
}

export async function getUserDetails(tokens) {
  return pmRequest('/accounts/v1/user/details', {
    accessToken: tokens.accessToken,
    readToken: tokens.readAccessToken,
    tokens: ['access_token', 'read_access_token'],
  });
}

export async function logoutSession(tokens) {
  return pmRequest('/accounts/v1/logout', {
    method: 'DELETE',
    accessToken: tokens.accessToken,
    tokens: ['access_token', 'public_access_token', 'read_access_token'],
  });
}

export async function loadSecurityMaster(fileName = 'NSE_EQ') {
  const result = await pmRequest(`/data/v1/scrips/${fileName}`, { tokens: [] });
  const rows = result?.data || result?.scrips || [];
  for (const row of rows) {
    const symbol = (row.symbol || row.SYMBOL || row.trading_symbol || '').toUpperCase();
    const id = row.security_id || row.SECURITY_ID || row.scrip_id;
    if (symbol && id) securityIdCache.set(symbol, Number(id));
  }
  logger.info(`Paytm security master loaded: ${fileName} (${rows.length} rows)`);
  return rows.length;
}

export async function resolveSecurityId(symbol, exchange = 'NSE') {
  const sym = symbol.toUpperCase().replace('.NS', '').replace('.BO', '').trim();
  if (securityIdCache.has(sym)) return securityIdCache.get(sym);

  const file = exchange === 'BSE' ? 'BSE_EQ' : 'NSE_EQ';
  await loadSecurityMaster(file);
  if (securityIdCache.has(sym)) return securityIdCache.get(sym);

  throw new Error(`Could not find Paytm security_id for ${sym}. Check symbol on ${exchange}.`);
}

export function getPaytmBrokerAccount(user) {
  return user.brokerAccounts?.find((b) => b.broker === 'paytm_money' && b.isActive);
}

export function getPaytmTokens(user) {
  const account = getPaytmBrokerAccount(user);
  if (!account?.accessToken) return null;
  return {
    accessToken: account.accessToken,
    publicAccessToken: account.publicAccessToken,
    readAccessToken: account.readAccessToken,
  };
}
