import {
  createContext, useContext, useCallback, useEffect, useRef, useState,
} from 'react';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

const GUEST_KEY = 'petcare_cart';
const CartContext = createContext(null);

/* ---------- guest storage ---------- */
const readGuest = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuest = (items) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    // Private mode -- cart just won't survive a refresh
  }
};

const clearGuest = () => {
  try { localStorage.removeItem(GUEST_KEY); } catch { /* ignore */ }
};

/* Both sources normalise to { product, quantity } so the UI never branches. */
const fromServer = (cart) =>
  (cart?.items || []).map((i) => ({ product: i.product, quantity: i.quantity }));

const idOf = (p) => p?._id || p?.id;

export const CartProvider = ({ children }) => {
  const { isAuthed, ready } = useAuth();
  const [items, setItems] = useState(() => readGuest());
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const wasAuthed = useRef(false);

  /* Keep the guest copy in storage while signed out */
  useEffect(() => {
    if (!isAuthed) writeGuest(items);
  }, [items, isAuthed]);

  /* On sign-in: push the guest cart up, then adopt the server's version.
     On sign-out: drop back to an empty guest cart. */
  useEffect(() => {
    if (!ready) return;
    let alive = true;

    const sync = async () => {
      if (isAuthed && !wasAuthed.current) {
        wasAuthed.current = true;
        setSyncing(true);
        try {
          const guest = readGuest();
          const payload = guest
            .map((i) => ({ productId: idOf(i.product), quantity: i.quantity }))
            .filter((i) => i.productId);

          const cart = payload.length
            ? await cartService.merge(payload)
            : await cartService.get();

          if (!alive) return;
          clearGuest();
          setItems(fromServer(cart));
        } catch {
          if (alive) setError("Couldn't sync your bag. Changes may not be saved.");
        } finally {
          if (alive) setSyncing(false);
        }
      }

      if (!isAuthed && wasAuthed.current) {
        wasAuthed.current = false;
        setItems([]);
        clearGuest();
      }
    };

    sync();
    return () => { alive = false; };
  }, [isAuthed, ready]);

  /* Optimistic write: update locally first, reconcile with the server after.
     Keeps the UI instant and rolls back if the call fails. */
  const commit = useCallback(
    async (nextItems, serverCall) => {
      const previous = items;
      setItems(nextItems);
      setError(null);

      if (!isAuthed) return;

      try {
        const cart = await serverCall();
        setItems(fromServer(cart));
      } catch {
        setItems(previous);
        setError("Couldn't update your bag. Please try again.");
      }
    },
    [items, isAuthed]
  );

  const add = useCallback(
    (product, quantity = 1) => {
      const id = idOf(product);
      if (!id) return;

      const existing = items.find((i) => idOf(i.product) === id);
      const next = existing
        ? items.map((i) =>
            idOf(i.product) === id ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...items, { product, quantity }];

      return commit(next, () => cartService.add(id, quantity));
    },
    [items, commit]
  );

  const setQty = useCallback(
    (id, quantity) => {
      const next =
        quantity <= 0
          ? items.filter((i) => idOf(i.product) !== id)
          : items.map((i) => (idOf(i.product) === id ? { ...i, quantity } : i));

      return commit(next, () =>
        quantity <= 0 ? cartService.remove(id) : cartService.update(id, quantity)
      );
    },
    [items, commit]
  );

  const remove = useCallback(
    (id) => commit(items.filter((i) => idOf(i.product) !== id), () => cartService.remove(id)),
    [items, commit]
  );

  const clear = useCallback(() => commit([], () => cartService.clear()), [commit]);

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, count, subtotal, syncing, error,
        add, setQty, remove, clear,
        qtyOf: (id) => items.find((i) => idOf(i.product) === id)?.quantity || 0,
        isGuest: !isAuthed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
