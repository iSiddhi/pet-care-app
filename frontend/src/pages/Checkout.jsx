import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, AlertCircle, Truck, Smartphone, ArrowRight } from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import UpiPayment from '../components/UpiPayment';
import { fadeUp, stagger, EASE } from '../components/ui/motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

const SHIPPING_FLAT = 4.99;
const FREE_OVER = 75;

const Checkout = () => {
  const cart = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 'address' -> fill the form, 'pay' -> UPI screen takes over
  const [stage, setStage] = useState('address');
  const [created, setCreated] = useState(null); // { order, payment }

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    line1: '', city: '', state: '', postalCode: '',
    country: 'India', phone: user?.phone || '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [placing, setPlacing] = useState(false);

  const shipping = cart.subtotal >= FREE_OVER ? 0 : SHIPPING_FLAT;
  const total = cart.subtotal + shipping;

  const validate = () => {
    const next = {};
    if (!address.fullName.trim()) next.fullName = 'Required';
    if (!address.line1.trim()) next.line1 = 'Required';
    if (!address.city.trim()) next.city = 'Required';
    if (!address.postalCode.trim()) next.postalCode = 'Required';
    if (!address.phone.trim()) next.phone = 'Required';
    else if (!/^[0-9+\-\s()]{10,15}$/.test(address.phone))
      next.phone = 'Enter a valid phone number';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const change = (e) => {
    const { name, value } = e.target;
    setAddress((a) => ({ ...a, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setPlacing(true);
    setServerError(null);
    try {
      // Server recomputes every price from the DB and hands back the UPI QR.
      // The cart stays put until payment is verified.
      const result = await orderService.create({ shippingAddress: address });
      setCreated(result);
      setStage('pay');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Could not start the payment. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  /* ---------- payment ---------- */
  if (stage === 'pay' && created) {
    return (
      <div className="min-h-screen pb-24">
        <PageHeader
          eyebrow="Payment"
          title="Pay with UPI"
          subtitle={`Order #${String(created.order._id).slice(-8).toUpperCase()} is reserved for you.`}
        />
        <Container className="pt-4">
          <UpiPayment
            orderId={created.order._id}
            initialPayment={created.payment}
            onVerified={() => cart.clear()}
          />
        </Container>
      </div>
    );
  }

  /* ---------- empty ---------- */
  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh]">
        <PageHeader eyebrow="Checkout" title="Nothing to check out yet" />
        <Container className="pt-4">
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is empty"
            body="Add a few essentials and come back."
            actionLabel="Browse essentials"
            onAction={() => navigate('/essentials')}
          />
        </Container>
      </div>
    );
  }

  /* ---------- address ---------- */
  return (
    <div className="min-h-screen pb-24">
      <PageHeader eyebrow="Checkout" title="Where should it go?" />

      <Container className="pt-4">
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 lg:gap-12 items-start">
          <motion.form
            onSubmit={submit}
            noValidate
            variants={stagger(0, 0.08)}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-[2rem] bg-cream border border-hairline shadow-soft p-7 sm:p-8"
            >
              <div className="flex items-center gap-2.5 mb-7">
                <Truck size={17} className="text-blush-500" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-mute">
                  Shipping address
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <F label="Full name" name="fullName" value={address.fullName} onChange={change} error={errors.fullName} className="sm:col-span-2" />
                <F label="Address" name="line1" value={address.line1} onChange={change} error={errors.line1} placeholder="House number, street, area" className="sm:col-span-2" />
                <F label="City" name="city" value={address.city} onChange={change} error={errors.city} />
                <F label="State" name="state" value={address.state} onChange={change} />
                <F label="Postal code" name="postalCode" value={address.postalCode} onChange={change} error={errors.postalCode} />
                <F label="Phone" name="phone" type="tel" value={address.phone} onChange={change} error={errors.phone} />
              </div>
            </motion.div>

            {/* UPI is the only method, so this states it rather than asking */}
            <motion.div
              variants={fadeUp}
              className="rounded-[2rem] bg-cream border border-hairline shadow-soft p-7 sm:p-8"
            >
              <div className="flex items-center gap-2.5 mb-6">
                <Smartphone size={17} className="text-blush-500" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-mute">
                  Payment
                </h2>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-blush-50 px-5 py-4">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-cream text-blush-600 shrink-0">
                  <Smartphone size={18} strokeWidth={1.9} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">UPI</p>
                  <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                    You'll get a QR to scan with GPay, PhonePe, Paytm or any bank app
                    on the next step.
                  </p>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-2xl bg-blush-50 px-5 py-4">
                    <AlertCircle size={17} className="text-blush-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-ink">{serverError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Summary */}
          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="rounded-[2rem] bg-shell p-7 lg:sticky lg:top-28"
          >
            <h2 className="font-display text-xl font-semibold text-ink mb-6">
              Order summary
            </h2>

            <div className="space-y-4 max-h-64 overflow-y-auto chat-scrollbar pr-1">
              {cart.items.map(({ product, quantity }) => (
                <div key={product._id || product.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-mist shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 grid place-items-center w-5 h-5 rounded-full bg-ink text-cream text-[0.6rem] font-bold tabular-nums">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink leading-snug truncate">{product.name}</p>
                    <p className="text-xs text-ink-mute mt-0.5 tabular-nums">
                      ${product.price.toFixed(2)} each
                    </p>
                  </div>
                  <span className="text-sm font-medium text-ink tabular-nums shrink-0">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-hairline space-y-3">
              <Row label="Subtotal" value={`$${cart.subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />
              <div className="pt-3 border-t border-hairline flex items-center justify-between">
                <span className="font-medium text-ink">Total</span>
                <span className="font-display text-2xl font-semibold text-ink tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-ink-mute text-right">
                Charged in rupees on the next step
              </p>
            </div>

            <Button
              as="button"
              type="submit"
              onClick={submit}
              size="lg"
              className="w-full mt-7"
              disabled={placing}
            >
              {placing ? 'Preparing payment…' : 'Continue to UPI'}
              {!placing && <ArrowRight size={16} strokeWidth={2.2} />}
            </Button>

            <Link
              to="/essentials"
              className="block text-center text-xs text-ink-mute hover:text-blush-500 transition-colors mt-4"
            >
              Keep shopping
            </Link>
          </motion.aside>
        </div>
      </Container>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-ink-soft">{label}</span>
    <span className="text-ink tabular-nums">{value}</span>
  </div>
);

const F = ({ label, name, value, onChange, error, placeholder, type = 'text', className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-ink mb-2">
      {label}
    </label>
    <input
      id={name} name={name} type={type} value={value}
      onChange={onChange} placeholder={placeholder}
      className={`w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink placeholder:text-ink-mute
        outline-none transition-shadow focus:ring-2
        ${error ? 'ring-2 ring-blush-300' : 'focus:ring-blush-300'}`}
    />
    {error && <p className="mt-1.5 text-xs text-blush-600">{error}</p>}
  </div>
);

export default Checkout;
