import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, CalendarCheck, User, Mail, Phone, ShieldCheck, AlertCircle, XCircle, BadgeCheck,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
import { useAuth } from '../context/AuthContext';
import AdminPayments from '../components/AdminPayments';
import { orderService, bookingService } from '../services/api';

const BASE_TABS = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'profile', label: 'Profile', icon: User },
];

const ADMIN_TAB = { key: 'payments', label: 'Verify payments', icon: BadgeCheck };

const STATUS_TONE = {
  placed: 'bg-lilac-100 text-lilac-400',
  processing: 'bg-blush-50 text-blush-500',
  shipped: 'bg-sage-100 text-sage-300',
  delivered: 'bg-sage-100 text-sage-300',
  cancelled: 'bg-mist text-ink-mute',
  awaiting_payment: 'bg-blush-50 text-blush-500',
  pending: 'bg-blush-50 text-blush-500',
  confirmed: 'bg-sage-100 text-sage-300',
  completed: 'bg-sage-100 text-sage-300',
  // payment states
  awaiting: 'bg-blush-50 text-blush-500',
  submitted: 'bg-lilac-100 text-lilac-400',
  verified: 'bg-sage-100 text-sage-300',
  failed: 'bg-mist text-ink-mute',
};

const PAYMENT_LABEL = {
  awaiting: 'Awaiting payment',
  submitted: 'Verifying payment',
  verified: 'Paid',
  failed: 'Payment failed',
};

const Account = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const TABS = user?.role === 'admin' ? [...BASE_TABS, ADMIN_TAB] : BASE_TABS;
  const tab = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'orders';

  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    Promise.allSettled([orderService.myOrders(), bookingService.mine()])
      .then(([o, b]) => {
        if (o.status === 'fulfilled') setOrders(o.value || []);
        if (b.status === 'fulfilled') setBookings(b.value || []);
        if (o.status === 'rejected' && b.status === 'rejected') {
          setError("We couldn't load your account. Check that the server is running.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancelBooking = async (id) => {
    try {
      const updated = await bookingService.cancel(id);
      setBookings((list) => list.map((b) => (b._id === id ? updated : b)));
    } catch {
      setError("Couldn't cancel that booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-shell">
      <PageHeader
        eyebrow="Your account"
        title={`Hello, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Your orders, grooming bookings and account details."
      />

      <Container className="pt-8">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 border-b border-hairline mb-10 overflow-x-auto no-scrollbar">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setParams({ tab: key })}
              className={`relative shrink-0 flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors
                ${tab === key ? 'text-ink' : 'text-ink-soft hover:text-ink'}`}
            >
              <Icon size={16} strokeWidth={1.9} />
              {label}
              {tab === key && (
                <motion.span
                  layoutId="account-tab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-blush-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl bg-blush-50 px-5 py-4 mb-8">
            <AlertCircle size={17} className="text-blush-600 shrink-0 mt-0.5" />
            <p className="text-sm text-ink">{error}</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-3xl shimmer" />
                ))}
              </div>
            ) : tab === 'orders' ? (
              orders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No orders yet"
                  body="When you place an order it'll show up here."
                />
              ) : (
                <motion.div variants={stagger(0, 0.07)} initial="hidden" animate="show" className="space-y-4">
                  {orders.map((o) => (
                    <motion.div
                      key={o._id}
                      variants={fadeUp}
                      className="rounded-3xl bg-cream border border-hairline p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <p className="font-medium text-ink">
                            #{String(o._id).slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-ink-mute mt-1">
                            {new Date(o.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                            {' · '}{o.paymentMethod}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {o.payment?.status && (
                            <Badge
                              status={o.payment.status}
                              label={PAYMENT_LABEL[o.payment.status]}
                            />
                          )}
                          <Badge status={o.status} />
                        </div>
                      </div>

                      <div className="flex -space-x-3 mb-5">
                        {o.items.slice(0, 5).map((it, i) => (
                          <div
                            key={i}
                            className="w-12 h-12 rounded-xl overflow-hidden bg-mist border-2 border-cream"
                          >
                            <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {o.items.length > 5 && (
                          <div className="grid place-items-center w-12 h-12 rounded-xl bg-mist border-2 border-cream text-xs font-semibold text-ink-soft">
                            +{o.items.length - 5}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-hairline">
                        <span className="text-sm text-ink-soft">
                          {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                        </span>
                        <span className="text-base font-semibold text-ink tabular-nums">
                          ${o.totalPrice.toFixed(2)}
                        </span>
                      </div>

                      {o.payment?.utr && (
                        <p className="text-xs text-ink-mute mt-3">
                          UPI reference <span className="font-mono">{o.payment.utr}</span>
                        </p>
                      )}
                      {o.payment?.status === 'failed' && o.payment.failureReason && (
                        <p className="text-xs text-blush-600 mt-3">{o.payment.failureReason}</p>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : tab === 'payments' ? (
              <AdminPayments />
            ) : tab === 'bookings' ? (
              bookings.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No bookings yet"
                  body="Book a grooming session and it'll appear here."
                  actionLabel="Browse grooming"
                  onAction={() => { window.location.href = '/grooming'; }}
                />
              ) : (
                <motion.div variants={stagger(0, 0.07)} initial="hidden" animate="show" className="space-y-4">
                  {bookings.map((b) => (
                    <motion.div
                      key={b._id}
                      variants={fadeUp}
                      className="rounded-3xl bg-cream border border-hairline p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {b.groomer?.avatar && (
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-mist shrink-0">
                              <img src={b.groomer.avatar} alt={b.groomer.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-ink">{b.service}</p>
                            <p className="text-sm text-ink-soft mt-0.5">
                              with {b.groomer?.name || 'our team'}
                            </p>
                            <p className="text-xs text-ink-mute mt-1.5">
                              {new Date(b.date).toLocaleDateString('en-IN', {
                                weekday: 'short', day: 'numeric', month: 'short',
                              })}{' at '}{b.timeSlot}{' · '}{b.petType}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <Badge status={b.status} />
                          {['pending', 'confirmed'].includes(b.status) && (
                            <button
                              onClick={() => cancelBooking(b._id)}
                              className="inline-flex items-center gap-1.5 text-xs text-ink-mute hover:text-blush-600 transition-colors"
                            >
                              <XCircle size={13} />
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )
            ) : (
              <motion.div variants={stagger(0, 0.08)} initial="hidden" animate="show" className="max-w-lg">
                <motion.div variants={fadeUp} className="rounded-2xl bg-cream border border-hairline p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="grid place-items-center w-14 h-14 rounded-2xl bg-blush-200 text-blush-600 font-bold">
                      {user?.name?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                    </span>
                    <div>
                      <p className="text-lg font-semibold text-ink">{user?.name}</p>
                      {user?.role === 'admin' && (
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blush-100 text-blush-600 text-[0.65rem] font-bold uppercase tracking-wide">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <Detail icon={Mail} label="Email" value={user?.email} />
                    {user?.phone && <Detail icon={Phone} label="Phone" value={user.phone} />}
                    <Detail icon={ShieldCheck} label="Account type" value={user?.role === 'admin' ? 'Administrator' : 'Customer'} />
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
                  <Button to="/essentials" variant="outline">Browse essentials</Button>
                  <Button to="/grooming" variant="outline">Book grooming</Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </div>
  );
};

const Badge = ({ status, label }) => (
  <span
    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
      label ? '' : 'capitalize'
    } ${STATUS_TONE[status] || 'bg-mist text-ink-soft'}`}
  >
    {label || String(status).replace(/_/g, ' ')}
  </span>
);

const Detail = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <span className="grid place-items-center w-10 h-10 rounded-2xl bg-cream text-blush-500 shrink-0">
      <Icon size={17} strokeWidth={1.9} />
    </span>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">{label}</p>
      <p className="text-sm text-ink mt-1 break-words">{value}</p>
    </div>
  </div>
);

export default Account;
