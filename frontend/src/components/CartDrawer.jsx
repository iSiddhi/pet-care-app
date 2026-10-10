import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, Loader2, AlertCircle, LogIn } from 'lucide-react';

import { useCart } from '../context/CartContext';
import Button from './ui/Button';
import { EASE } from './ui/motion';

const SHIPPING_FLAT = 4.99;
const FREE_OVER = 75;

const CartDrawer = ({ open, onClose }) => {
  const cart = useCart();
  const shipping = cart.subtotal >= FREE_OVER || cart.subtotal === 0 ? 0 : SHIPPING_FLAT;
  const remaining = Math.max(0, FREE_OVER - cart.subtotal);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-ink/25 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-[min(26rem,100vw)] bg-cream flex flex-col shadow-lift"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-hairline shrink-0">
              <h2 className="text-lg font-semibold text-ink flex items-center gap-2">
                Your bag
                {cart.count > 0 && (
                  <span className="text-sm font-sans font-medium text-ink-mute">
                    ({cart.count})
                  </span>
                )}
                {cart.syncing && (
                  <Loader2 size={15} className="animate-spin text-ink-mute" />
                )}
              </h2>
              <button
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-full text-ink-soft hover:bg-mist transition-colors"
                aria-label="Close bag"
              >
                <X size={18} />
              </button>
            </div>

            {cart.error && (
              <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-2xl bg-blush-50 px-4 py-3">
                <AlertCircle size={15} className="text-blush-600 shrink-0 mt-0.5" />
                <p className="text-xs text-ink">{cart.error}</p>
              </div>
            )}

            {cart.items.length === 0 ? (
              <div className="flex-1 grid place-items-center px-6">
                <div className="text-center">
                  <span className="inline-grid place-items-center w-14 h-14 rounded-3xl bg-mist text-ink-mute mb-5">
                    <ShoppingBag size={24} strokeWidth={1.8} />
                  </span>
                  <p className="font-medium text-ink mb-1.5">Your bag is empty</p>
                  <p className="text-sm text-ink-soft mb-6">
                    Add a few essentials and they'll show up here.
                  </p>
                  <Button to="/essentials" onClick={onClose} variant="soft" size="sm">
                    Browse essentials
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {remaining > 0 && (
                  <div className="px-6 pt-5">
                    <div className="rounded-2xl bg-blush-50 px-4 py-3">
                      <p className="text-xs text-blush-600 font-medium mb-2">
                        ${remaining.toFixed(2)} away from free shipping
                      </p>
                      <div className="h-1.5 rounded-full bg-blush-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (cart.subtotal / FREE_OVER) * 100)}%` }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="h-full rounded-full bg-blush-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 overflow-y-auto chat-scrollbar px-6 py-5 space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cart.items.map(({ product, quantity }) => {
                      const id = product._id || product.id;
                      return (
                        <motion.div
                          key={id}
                          layout
                          exit={{ opacity: 0, x: 24 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4"
                        >
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-mist shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink leading-snug truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-ink-mute mt-0.5">{product.category}</p>

                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center gap-1 rounded-full border border-hairline p-0.5">
                                <button
                                  onClick={() => cart.setQty(id, quantity - 1)}
                                  className="grid place-items-center w-6 h-6 rounded-full text-ink-soft hover:bg-mist transition-colors"
                                  aria-label="Decrease"
                                >
                                  <Minus size={12} strokeWidth={2.5} />
                                </button>
                                <span className="w-5 text-center text-xs font-semibold tabular-nums">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => cart.setQty(id, quantity + 1)}
                                  className="grid place-items-center w-6 h-6 rounded-full text-ink-soft hover:bg-mist transition-colors"
                                  aria-label="Increase"
                                >
                                  <Plus size={12} strokeWidth={2.5} />
                                </button>
                              </div>

                              <span className="text-sm font-semibold text-ink tabular-nums">
                                ${(product.price * quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => cart.remove(id)}
                            className="self-start grid place-items-center w-7 h-7 rounded-full text-ink-mute hover:text-blush-500 hover:bg-blush-50 transition-colors shrink-0"
                            aria-label={`Remove ${product.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="border-t border-hairline px-6 py-5 space-y-3 shrink-0">
                  {cart.isGuest && (
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="flex items-start gap-2.5 rounded-2xl bg-mist px-4 py-3 mb-1 hover:bg-blush-50 transition-colors"
                    >
                      <LogIn size={15} className="text-blush-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-ink-soft leading-relaxed">
                        <span className="font-medium text-ink">Sign in</span> to save this
                        bag to your account — we'll keep everything you've added.
                      </p>
                    </Link>
                  )}

                  <Row label="Subtotal" value={`$${cart.subtotal.toFixed(2)}`} />
                  <Row label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`} />

                  <div className="pt-3 border-t border-hairline flex items-center justify-between">
                    <span className="font-medium text-ink">Total</span>
                    <span className="text-lg font-semibold text-ink tabular-nums">
                      ${(cart.subtotal + shipping).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    to={cart.isGuest ? '/login' : '/checkout'}
                    onClick={onClose}
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                  >
                    {cart.isGuest ? 'Sign in to checkout' : 'Checkout'}
                  </Button>

                  <button
                    onClick={cart.clear}
                    className="w-full text-xs text-ink-mute hover:text-blush-500 transition-colors pt-1"
                  >
                    Clear bag
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-ink-soft">{label}</span>
    <span className="text-ink tabular-nums">{value}</span>
  </div>
);

export default CartDrawer;
