/**
 * Verifies the UPI link + QR generation without touching the DB.
 *   npm run test:upi
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const upi = require('../utils/upi');

const ok = (m) => console.log(`  PASS  ${m}`);
const bad = (m) => console.log(`  FAIL  ${m}`);
const info = (m) => console.log(`        ${m}`);

(async () => {
  console.log('\nUPI configuration check\n' + '-'.repeat(52));

  const { vpa, name, rate } = upi.config();

  if (!vpa) {
    bad('MERCHANT_VPA is empty in .env');
    info('Put your own UPI ID there, e.g. 9876543210@ybl or name@okicici');
    info('Money from the QR lands in that account directly.');
    process.exit(1);
  }

  if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(vpa)) {
    bad(`"${vpa}" does not look like a UPI ID`);
    info('Expected something like 9876543210@ybl or yourname@okicici');
    process.exit(1);
  }
  ok(`Merchant VPA: ${vpa}`);
  ok(`Payee name:   ${name}`);
  ok(`USD -> INR:   ${rate}`);

  console.log('\nGenerated payment link\n' + '-'.repeat(52));
  const totalUSD = 59.98;
  const amountINR = upi.toINR(totalUSD);
  const txnRef = upi.makeTxnRef();
  const uri = upi.buildUpiUri({ amountINR, txnRef, note: 'Order TEST1234' });

  ok(`$${totalUSD} converts to ₹${amountINR.toLocaleString('en-IN')}`);
  ok(`Reference: ${txnRef}`);
  info('');
  info(uri);

  for (const key of ['pa=', 'pn=', 'am=', 'cu=INR', 'tr=']) {
    if (!uri.includes(key)) {
      bad(`URI is missing ${key}`);
      process.exit(1);
    }
  }
  ok('URI has every field UPI apps require');

  if (uri.includes('+')) {
    bad('URI contains "+" — some UPI apps read it as a literal plus, not a space');
    process.exit(1);
  }
  ok('Spaces are percent-encoded correctly');

  console.log('\nQR code\n' + '-'.repeat(52));
  const png = await upi.buildQrDataUrl(uri);
  ok(`PNG data URL generated (${(png.length / 1024).toFixed(1)} KB)`);

  console.log('\nUTR validation\n' + '-'.repeat(52));
  const utrCases = [
    ['123456789012', true],
    ['12345678901', false],
    ['1234567890123', false],
    ['12345678901a', false],
    ['', false],
  ];
  let allOk = true;
  for (const [v, expected] of utrCases) {
    const got = upi.isValidUtr(v);
    if (got !== expected) { allOk = false; bad(`isValidUtr("${v}") returned ${got}`); }
  }
  if (allOk) ok('Accepts 12 digits, rejects everything else');

  console.log('\nReady. Scan the URI above with a UPI app to test for real.');
  console.log('Tip: send ₹1 to yourself first to confirm the VPA is right.\n');
})();
