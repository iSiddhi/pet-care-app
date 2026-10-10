import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, Copy, Check, Clock, Loader2, CheckCircle2,
  XCircle, ShieldCheck, RefreshCw, ScanLine,
} from 'lucide-react';

import Button from './ui/Button';
import { fadeUp, stagger, EASE } from './ui/motion';
import { orderService } from '../services/api';

const POLL_MS = 4000;

// Most apps honour the generic upi:// link. These schemes jump straight
// into one app, which is friendlier on mobile.
const APPS = [
  { name: 'Google Pay', scheme: (u) => u.replace('upi://', 'tez://upi/') },
  { name: 'PhonePe', scheme: (u) => u.replace('upi://', 'phonepe://') },
  { name: 'Paytm', scheme: (u) => u.replace('upi://', 'paytmmp://') },
];

const mmss = (ms) => {
  const t = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

const UpiPayment = ({ orderId, initialPayment, onVerified }) => {
  const [payment, setPayment] = useState(initialPayment);
  const [left, setLeft] = useState(initialPayment?.expiresInMs || 0);
  const [utr, setUtr] = useState('');
  const [utrError, setUtrError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(null);
  const notified = useRef(false);

  const status = payment?.status;
  const live = status === 'awaiting' || status === 'submitted';

  /* Poll the server while the payment is still open. UPI gives us no
     callback, so this is how the screen learns about verification. */
  const refresh = useCallback(async () => {
    try {
      const { payment: next } = await orderService.payment(orderId);
      setPayment(next);
      setLeft(next.expiresInMs);
    } catch {
      // Transient failure -- the next tick will try again
    }
  }, [orderId]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(refresh, POLL_MS);
    return () => clearInterval(id);
  }, [live, refresh]);

  /* Local countdown so the timer moves every second, not every poll */
  useEffect(() => {
    if (status !== 'awaiting') return;
    const id = setInterval(() => setLeft((v) => Math.max(0, v - 1000)), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (status === 'verified' && !notified.current) {
      notified.current = true;
      onVerified?.(payment);
    }
  }, [status, payment, onVerified]);

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  const submitUtr = async (e) => {
    e.preventDefault();
    const clean = utr.trim();

    if (!/^\d{12}$/.test(clean)) {
      setUtrError('A UPI reference number is exactly 12 digits');
      return;
    }

    setSubmitting(true);
    setUtrError(null);
    try {
      const next = await orderService.submitUtr(orderId, clean);
      setPayment(next);
    } catch (err) {
      setUtrError(err.response?.data?.message || 'Could not submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- verified ---------- */
  if (status === 'verified') {
    return (
      <Shell>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-sage-100 text-sage-300 mb-6"
        >
          <CheckCircle2 size={30} strokeWidth={2} />
        </motion.div>
        <h2 className="text-xl font-semibold text-ink">Payment confirmed</h2>
        <p className="mt-3 text-ink-soft leading-relaxed">
          We've received ₹{payment.amountINR?.toLocaleString('en-IN')} and your order
          is now being prepared.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/account?tab=orders" size="lg">View order</Button>
          <Button to="/essentials" variant="outline" size="lg">Keep shopping</Button>
        </div>
      </Shell>
    );
  }

  /* ---------- failed ---------- */
  if (status === 'failed') {
    return (
      <Shell>
        <span className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-blush-100 text-blush-600 mb-6">
          <XCircle size={30} strokeWidth={2} />
        </span>
        <h2 className="text-xl font-semibold text-ink">Payment not completed</h2>
        <p className="mt-3 text-ink-soft leading-relaxed">
          {payment.failureReason || 'This payment could not be verified.'}
        </p>
        <p className="mt-2 text-sm text-ink-mute">
          If money left your account, contact us with reference{' '}
          <span className="font-mono text-ink">{payment.txnRef}</span> and we'll sort it out.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button to="/essentials" size="lg">Back to shop</Button>
          <Button to="/contact" variant="outline" size="lg">Contact us</Button>
        </div>
      </Shell>
    );
  }

  /* ---------- submitted, awaiting verification ---------- */
  if (status === 'submitted') {
    return (
      <Shell>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          className="inline-grid place-items-center w-16 h-16 rounded-3xl bg-blush-50 text-blush-500 mb-6"
        >
          <Loader2 size={30} strokeWidth={2} />
        </motion.span>
        <h2 className="text-xl font-semibold text-ink">Verifying your payment</h2>
        <p className="mt-3 text-ink-soft leading-relaxed max-w-sm mx-auto">
          We're checking reference{' '}
          <span className="font-mono text-ink">{payment.utr}</span> against our account.
          This usually takes a few minutes.
        </p>

        <div className="mt-7 rounded-2xl bg-shell px-5 py-4 text-left max-w-sm mx-auto space-y-2.5">
          <Line label="Amount" value={`₹${payment.amountINR?.toLocaleString('en-IN')}`} />
          <Line label="Reference" value={payment.txnRef} mono />
          <Line label="UTR" value={payment.utr} mono />
        </div>

        <p className="mt-6 text-xs text-ink-mute flex items-center justify-center gap-2">
          <RefreshCw size={12} className="animate-spin" />
          This page updates on its own — you can safely leave it open.
        </p>

        <div className="mt-6">
          <Button to="/account?tab=orders" variant="outline" size="sm">
            Check later in your orders
          </Button>
        </div>
      </Shell>
    );
  }

  /* ---------- awaiting payment ---------- */
  const expired = left <= 0 || payment?.expired;

  return (
    <motion.div variants={stagger(0, 0.08)} initial="hidden" animate="show">
      <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
        {/* QR side */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-cream border border-hairline shadow-soft p-7 sm:p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <ScanLine size={16} className="text-blush-500" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-mute">
              Scan to pay
            </h2>
          </div>

          <p className="text-3xl font-semibold text-ink mt-5">
            ₹{payment.amountINR?.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-ink-mute mt-1">
            ≈ ${payment.amountUSD?.toFixed(2)} · includes shipping
          </p>

          <div className="relative inline-block mt-6">
            <div className={`rounded-3xl overflow-hidden border border-hairline ${expired ? 'opacity-25' : ''}`}>
              <img
                src={payment.qrDataUrl}
                alt="UPI payment QR code"
                className="w-56 h-56 sm:w-64 sm:h-64"
              />
            </div>

            {expired && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="px-4 py-2 rounded-full bg-ink text-cream text-xs font-semibold">
                  QR expired
                </span>
              </div>
            )}
          </div>

          {!expired && (
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blush-50 text-blush-600 text-sm font-medium tabular-nums">
              <Clock size={14} />
              {mmss(left)} left
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-hairline space-y-2.5 text-left">
            <Line label="Paying to" value={payment.payeeName} />
            <CopyLine label="UPI ID" value={payment.vpa} onCopy={() => copy(payment.vpa, 'vpa')} copied={copied === 'vpa'} />
            <CopyLine label="Reference" value={payment.txnRef} mono onCopy={() => copy(payment.txnRef, 'ref')} copied={copied === 'ref'} />
          </div>

          {/* Mobile: jump straight into an app */}
          <div className="mt-6 lg:hidden">
            <a
              href={payment.upiUri}
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-ink text-cream text-sm font-medium"
            >
              <Smartphone size={16} strokeWidth={2.2} />
              Open any UPI app
            </a>
            <div className="flex gap-2 mt-3">
              {APPS.map((a) => (
                <a
                  key={a.name}
                  href={a.scheme(payment.upiUri)}
                  className="flex-1 text-center px-3 py-2.5 rounded-full border border-hairline text-xs font-medium text-ink-soft hover:border-blush-300 hover:bg-blush-50 transition-colors"
                >
                  {a.name}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Steps + UTR */}
        <motion.div variants={fadeUp} className="space-y-6">
          <div className="rounded-2xl bg-shell p-7 sm:p-8">
            <h3 className="text-base font-semibold text-ink mb-6">
              How to pay
            </h3>
            <ol className="space-y-4">
              {[
                'Open GPay, PhonePe, Paytm or your bank app',
                'Scan the QR code (or tap the button on mobile)',
                'Check the amount, then confirm the payment',
                'Copy the 12-digit UPI reference number it shows',
                'Paste it below so we can match your payment',
              ].map((step, i) => (
                <li key={i} className="flex gap-3.5 text-sm text-ink-soft leading-relaxed">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-blush-100 text-blush-600 text-xs font-bold shrink-0 tabular-nums">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <form
            onSubmit={submitUtr}
            className="rounded-2xl bg-cream border border-hairline shadow-soft p-7 sm:p-8"
          >
            <h3 className="text-base font-semibold text-ink mb-2">
              Already paid?
            </h3>
            <p className="text-sm text-ink-soft leading-relaxed mb-6">
              Enter the UPI reference number (UTR) from your payment app. It's 12 digits.
            </p>

            <input
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value.replace(/\D/g, '').slice(0, 12));
                if (utrError) setUtrError(null);
              }}
              inputMode="numeric"
              placeholder="123456789012"
              className={`w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink font-mono tracking-wider
                placeholder:text-ink-mute placeholder:font-sans placeholder:tracking-normal
                outline-none transition-shadow focus:ring-2
                ${utrError ? 'ring-2 ring-blush-300' : 'focus:ring-blush-300'}`}
            />

            <div className="flex items-center justify-between mt-2">
              <AnimatePresence>
                {utrError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-blush-600"
                  >
                    {utrError}
                  </motion.p>
                )}
              </AnimatePresence>
              <span className="text-xs text-ink-mute ml-auto tabular-nums">{utr.length}/12</span>
            </div>

            <Button
              as="button"
              type="submit"
              size="lg"
              className="w-full mt-5"
              disabled={submitting || utr.length !== 12}
            >
              {submitting ? 'Submitting…' : "I've paid — submit reference"}
            </Button>

            <p className="flex items-start gap-2 text-xs text-ink-mute mt-5 leading-relaxed">
              <ShieldCheck size={13} className="shrink-0 mt-0.5 text-sage-300" />
              We verify every payment against our bank statement before dispatch.
              Your bag stays saved until it clears.
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Shell = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: EASE }}
    className="max-w-lg mx-auto text-center py-6"
  >
    {children}
  </motion.div>
);

const Line = ({ label, value, mono }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="text-ink-soft shrink-0">{label}</span>
    <span className={`text-ink truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
  </div>
);

const CopyLine = ({ label, value, mono, onCopy, copied }) => (
  <div className="flex items-center justify-between gap-3 text-sm">
    <span className="text-ink-soft shrink-0">{label}</span>
    <button
      type="button"
      onClick={onCopy}
      className="flex items-center gap-2 min-w-0 text-ink hover:text-blush-500 transition-colors group"
    >
      <span className={`truncate ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
      {copied ? (
        <Check size={13} className="text-sage-300 shrink-0" strokeWidth={2.5} />
      ) : (
        <Copy size={13} className="text-ink-mute group-hover:text-blush-500 shrink-0" />
      )}
    </button>
  </div>
);

export default UpiPayment;
