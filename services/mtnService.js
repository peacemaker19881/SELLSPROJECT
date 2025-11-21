// MTN MoMo (Rwanda) sandbox helper functions
// Implements: getAccessToken, requestToPay (Collection), disburse (Remittance/Disbursement)
// Follow MTN docs to create API user and API key first (one-time).
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const SUBSCRIPTION_KEY = process.env.MTN_MOMO_SUBSCRIPTION_KEY;
const API_USER_ID = process.env.MTN_API_USER_ID; // X-Reference-Id (UUID)
const API_KEY = process.env.MTN_API_KEY; // apiKey created for api user
const TARGET_ENV = process.env.MTN_TARGET_ENVIRONMENT || 'sandbox';

const BASE = TARGET_ENV === 'sandbox' ? 'https://sandbox.momodeveloper.mtn.com' : 'https://momodeveloper.mtn.com';

async function getAccessToken() {
  // For Collection: POST /collection/token/
  const url = `${BASE}/collection/token/`;
  const auth = Buffer.from(`${API_USER_ID}:${API_KEY}`).toString('base64');
  const headers = {
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'X-Target-Environment': TARGET_ENV,
    'Authorization': `Basic ${auth}`
  };
  const resp = await axios.post(url, null, { headers });
  // returns { access_token, expires_in }
  return resp.data;
}

async function requestToPay(amount, currency, externalId, payerPhone, payerMessage, payeeNote) {
  // amount: string or number, externalId: unique id for your system
  // POST /collection/v1_0/requesttopay
  const tokenResp = await getAccessToken();
  const token = tokenResp.access_token || tokenResp.accessToken || tokenResp;
  const url = `${BASE}/collection/v1_0/requesttopay`;
  const referenceId = uuidv4();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-Reference-Id': referenceId,
    'X-Target-Environment': TARGET_ENV,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'Content-Type': 'application/json'
  };
  const body = {
    amount: String(amount),
    currency: currency || 'RWF',
    externalId,
    payer: { partyIdType: 'MSISDN', partyId: payerPhone },
    payerMessage: payerMessage || 'Payment for order',
    payeeNote: payeeNote || 'Thanks for your purchase'
  };
  const resp = await axios.post(url, body, { headers });
  // Note: response may be 202 Accepted with empty body. Use referenceId to poll transaction status.
  return { referenceId, statusCode: resp.status, data: resp.data || null };
}

async function getRequestToPayStatus(referenceId) {
  const tokenResp = await getAccessToken();
  const token = tokenResp.access_token || tokenResp.accessToken || tokenResp;
  const url = `${BASE}/collection/v1_0/requesttopay/${referenceId}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'X-Target-Environment': TARGET_ENV
  };
  const resp = await axios.get(url, { headers });
  return resp.data;
}

// Disbursement (payment to seller) - path may differ depending on MTN product (remittance/disbursement)
async function disburseToMsisdn(amount, currency, externalId, receiverPhone) {
  const tokenResp = await getAccessToken(); // for disbursement you may need separate token endpoint - adapt per docs
  const token = tokenResp.access_token || tokenResp.accessToken || tokenResp;
  const url = `${BASE}/disbursement/v1_0/transfer`;
  const referenceId = uuid.v4();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'X-Reference-Id': referenceId,
    'X-Target-Environment': TARGET_ENV,
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
    'Content-Type': 'application/json'
  };
  const body = {
    amount: String(amount),
    currency: currency || 'RWF',
    externalId,
    payee: { partyIdType: 'MSISDN', partyId: receiverPhone },
    payerMessage: 'Payout',
    payeeNote: 'Seller payout'
  };
  const resp = await axios.post(url, body, { headers });
  return { referenceId, statusCode: resp.status, data: resp.data || null };
}

module.exports = { getAccessToken, requestToPay, getRequestToPayStatus, disburseToMsisdn };
