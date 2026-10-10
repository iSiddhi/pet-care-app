const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * UPI collect links, generated locally.
 *
 * There is no payment gateway here. The QR points straight at the
 * merchant VPA, so money lands in that account directly -- but UPI gives
 * us no callback, so the server can never *know* a payment happened.
 * That is why the flow ends with the customer submitting the UTR and a
 * human verifying it. Swap in a gateway and this file is what changes.
 */

const PAYMENT_WINDOW_MS = 15 * 60 * 1000; // QR is treated as stale after this

const config = () => ({
  vpa: process.env.MERCHANT_VPA || '',
  name: process.env.MERCHANT_NAME || 'Pet Care Hub',
  rate: Number(process.env.USD_TO_INR || 88),
});

const isConfigured = () => Boolean(config().vpa);

/** Prices are stored in USD; UPI only moves rupees. */
const toINR = (usd) => Math.round(usd * config().rate * 100) / 100;

/** Short, unique, and safe for the UPI `tr` field (alphanumeric only). */
const makeTxnRef = () =>
  `PCH${Date.now().toString(36).toUpperCase()}${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

/**
 * Builds the `upi://pay?...` URI every Indian UPI app understands.
 * Scanning it, or tapping it on mobile, opens the app prefilled.
 */
const buildUpiUri = ({ amountINR, txnRef, note }) => {
  const { vpa, name } = config();
  if (!vpa) throw new Error('MERCHANT_VPA is not set in .env');

  const params = new URLSearchParams({
    pa: vpa,                        // payee address
    pn: name,                       // payee name
    am: amountINR.toFixed(2),       // amount
    cu: 'INR',
    tn: (note || 'Pet Care Hub order').slice(0, 50), // transaction note
    tr: txnRef,                     // our reference, echoed in the statement
  });

  // UPI apps are picky: spaces must be %20, not +
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`;
};

/** PNG data URL, sized for a crisp scan on screen. */
const buildQrDataUrl = (uri) =>
  QRCode.toDataURL(uri, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 512,
    color: { dark: '#1F1A1C', light: '#FEFCFB' },
  });

/**
 * A UTR (Unique Transaction Reference) is the 12-digit number every UPI
 * app shows after a successful payment. We can't verify it automatically,
 * but we can reject anything that isn't shaped like one.
 */
const isValidUtr = (utr) => /^\d{12}$/.test(String(utr || '').trim());

const isExpired = (createdAt) =>
  Date.now() - new Date(createdAt).getTime() > PAYMENT_WINDOW_MS;

module.exports = {
  config,
  isConfigured,
  toINR,
  makeTxnRef,
  buildUpiUri,
  buildQrDataUrl,
  isValidUtr,
  isExpired,
  PAYMENT_WINDOW_MS,
};
