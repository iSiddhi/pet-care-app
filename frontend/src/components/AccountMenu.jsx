import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, CalendarCheck, LogOut, LogIn, ChevronDown } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { EASE } from './ui/motion';

const initials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'U';

const AccountMenu = () => {
  const { user, isAuthed, logout, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!ready) {
    return <div className="w-9 h-9 rounded-full shimmer" aria-hidden />;
  }

  if (!isAuthed) {
    return (
      <Link
        to="/login"
        state={{ from: location.pathname }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-ink-soft hover:text-ink hover:bg-cream/60 transition-colors"
      >
        <LogIn size={15} strokeWidth={2.1} />
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-cream/60 transition-colors"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="grid place-items-center w-8 h-8 rounded-full bg-blush-500 text-white text-xs font-bold">
          {initials(user.name)}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} className="text-ink-soft" strokeWidth={2.2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="absolute right-0 top-full mt-2 w-60 rounded-3xl bg-cream border border-hairline shadow-lift p-2 z-50"
          >
            <div className="px-3 py-3 border-b border-hairline mb-2">
              <p className="text-sm font-semibold text-ink truncate">{user.name}</p>
              <p className="text-xs text-ink-mute truncate mt-0.5">{user.email}</p>
              {user.role === 'admin' && (
                <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-blush-100 text-blush-600 text-[0.65rem] font-bold uppercase tracking-wide">
                  Admin
                </span>
              )}
            </div>

            <Item to="/account" icon={User}>Your account</Item>
            <Item to="/account?tab=orders" icon={Package}>Orders</Item>
            <Item to="/account?tab=bookings" icon={CalendarCheck}>Bookings</Item>

            <button
              onClick={() => { logout(); setOpen(false); navigate('/'); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-ink-soft hover:text-blush-600 hover:bg-blush-50 transition-colors mt-1"
            >
              <LogOut size={16} strokeWidth={1.9} />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Item = ({ to, icon: Icon, children }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-ink hover:bg-mist transition-colors"
  >
    <Icon size={16} strokeWidth={1.9} className="text-ink-soft" />
    {children}
  </Link>
);

export default AccountMenu;
