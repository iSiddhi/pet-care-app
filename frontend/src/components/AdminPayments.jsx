import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeCheck, XCircle, Copy, Check, RefreshCw, Inbox, Clock,
} from 'lucide-react';

import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { fadeUp, stagger } from './ui/motion';
import { orderService } from '../services/api';

const since = (date) => {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const AdminPayments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setOrders(await orderService.pendingPayments());
    } catch {
      setError("Couldn't load pending payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // New submissions arrive while this sits open
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const decide = async (id, approve) => {
    const reason = approve
      ? undefined
      : window.prompt('Why is this being rejected? (shown to the customer)') || 'Payment could not be verified';

    setBusy(id);
    try {
      await orderService.verifyPayment(id, approve, reason);
      setOrders((list) => list.filter((o) => o._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update that payment.');
    } finally {
      setBusy(null);
    }
  };

  const copy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch { /* clipboard blocked */ }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => <div key={i} className="h-40 rounded-3xl shimmer" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-soft">
          {orders.length === 0
            ? 'Nothing waiting'
            : `${orders.length} payment${orders.length === 1 ? '' : 's'} awaiting verification`}
        </p>
        <button
          onClick={load}
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl bg-blush-50 px-5 py-4 mb-6">
          <p className="text-sm text-ink">{error}</p>
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No payments to verify"
          body="When a customer submits a UPI reference it lands here. This list refreshes itself."
        />
      ) : (
        <motion.div variants={stagger(0, 0.07)} initial="hidden" animate="show" className="space-y-4">
          <AnimatePresence mode="popLayout">
            {orders.map((o) => (
              <motion.div
                key={o._id}
                layout
                variants={fadeUp}
                exit={{ opacity: 0, x: 24 }}
                className="rounded-3xl bg-cream border border-hairline p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="font-medium text-ink">
                      #{String(o._id).slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-ink-soft mt-0.5">
                      {o.user?.name} · {o.user?.email}
                    </p>
                    {o.user?.phone && (
                      <p className="text-xs text-ink-mute mt-0.5">{o.user.phone}</p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blush-50 text-blush-600 text-xs font-semibold">
                    <Clock size={12} />
                    {since(o.payment.submittedAt)}
                  </span>
                </div>

                {/* The two values to match against the bank statement */}
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  <Match
                    label="UTR to find"
                    value={o.payment.utr}
                    onCopy={() => copy(o.payment.utr, `${o._id}-utr`)}
                    copied={copied === `${o._id}-utr`}
                  />
                  <Match
                    label="Amount received"
                    value={`₹${o.payment.amountINR?.toLocaleString('en-IN')}`}
                    sub={`$${o.totalPrice.toFixed(2)}`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-mute mb-5">
                  <span>Ref <span className="font-mono text-ink-soft">{o.payment.txnRef}</span></span>
                  <span>{o.items.length} {o.items.length === 1 ? 'item' : 'items'}</span>
                  <span>{o.shippingAddress?.city}</span>
                </div>

                <div className="flex flex-wrap gap-3 pt-5 border-t border-hairline">
                  <Button
                    onClick={() => decide(o._id, true)}
                    variant="primary"
                    size="sm"
                    disabled={busy === o._id}
                  >
                    <BadgeCheck size={15} strokeWidth={2.2} />
                    {busy === o._id ? 'Working…' : 'Mark as received'}
                  </Button>
                  <Button
                    onClick={() => decide(o._id, false)}
                    variant="ghost"
                    size="sm"
                    disabled={busy === o._id}
                  >
                    <XCircle size={15} />
                    Reject
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="text-xs text-ink-mute leading-relaxed mt-8 max-w-xl">
        UPI sends no confirmation to the server, so each payment is matched by
        hand. Search the UTR in your bank or UPI app statement, confirm the
        amount, then approve. Approving marks the order paid and clears the
        customer's bag.
      </p>
    </div>
  );
};

const Match = ({ label, value, sub, onCopy, copied }) => (
  <div className="rounded-2xl bg-shell px-4 py-3.5">
    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink-mute mb-1.5">
      {label}
    </p>
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm text-ink tracking-wide truncate">{value}</span>
      {onCopy && (
        <button
          onClick={onCopy}
          className="text-ink-mute hover:text-blush-500 transition-colors shrink-0"
          aria-label="Copy"
        >
          {copied ? <Check size={13} className="text-sage-300" strokeWidth={2.5} /> : <Copy size={13} />}
        </button>
      )}
      {sub && <span className="text-xs text-ink-mute ml-auto shrink-0">{sub}</span>}
    </div>
  </div>
);

export default AdminPayments;
