import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PawPrint, ShoppingBag, Scissors, Search, Stethoscope,
  Images, Users, Menu, X, ChevronDown,
} from 'lucide-react';
import Container from './ui/Container';
import AccountMenu from './AccountMenu';
import CartDrawer from './CartDrawer';
import { useCart } from '../context/CartContext';
import { EASE } from './ui/motion';

const services = [
  { to: '/pet-services', label: 'Pet Services', desc: 'Browse pets by category', icon: PawPrint },
  { to: '/essentials', label: 'Essentials', desc: 'Food, toys and supplies', icon: ShoppingBag },
  { to: '/grooming', label: 'Grooming', desc: 'Book a trusted groomer', icon: Scissors },
  { to: '/pet-finder', label: 'Pet Finder', desc: 'Match with your pet', icon: Search },
  { to: '/disease-prediction', label: 'Health Check', desc: 'AI symptom guidance', icon: Stethoscope },
];

const links = [
  { to: '/gallery', label: 'Gallery', icon: Images },
  { to: '/team', label: 'Our Team', icon: Users },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const cart = useCart();

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Navbar only grows a hairline + shadow once the page has moved
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (to) => location.pathname === to;
  const servicesActive = services.some((s) => isActive(s.to));

  return (
    <>
      <header
        className={`sticky top-0 z-50 glass-bar transition-all duration-300
          ${scrolled ? 'border-b border-hairline shadow-soft' : 'border-b border-transparent'}`}
      >
        <Container>
          <nav className="flex items-center justify-between h-[72px]">
            {/* Wordmark */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-blush-100 text-blush-500 transition-colors group-hover:bg-blush-200">
                <PawPrint size={18} strokeWidth={2.2} />
              </span>
              <span className="text-base font-semibold tracking-tight text-ink">
                Pet Care Hub
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavItem to="/" active={isActive('/')}>Home</NavItem>

              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  onClick={() => setServicesOpen((v) => !v)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium
                    transition-colors duration-200
                    ${servicesActive ? 'text-ink bg-blush-50' : 'text-ink-soft hover:text-ink hover:bg-mist'}`}
                >
                  Services
                  <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={15} strokeWidth={2.2} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[22rem]"
                    >
                      <div className="rounded-3xl bg-cream border border-hairline shadow-lift p-2 overflow-hidden">
                        {services.map(({ to, label, desc, icon: Icon }) => (
                          <Link
                            key={to}
                            to={to}
                            className={`flex items-start gap-3 p-3 rounded-2xl transition-colors
                              ${isActive(to) ? 'bg-blush-50' : 'hover:bg-mist'}`}
                          >
                            <span className="mt-0.5 grid place-items-center w-9 h-9 rounded-xl bg-blush-50 text-blush-500 shrink-0">
                              <Icon size={17} strokeWidth={2} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-ink">{label}</span>
                              <span className="block text-xs text-ink-mute mt-0.5">{desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {links.map(({ to, label }) => (
                <NavItem key={to} to={to} active={isActive(to)}>{label}</NavItem>
              ))}
            </div>

            {/* Right side: bag + account */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCartOpen(true)}
                className="relative grid place-items-center w-10 h-10 rounded-full text-ink hover:bg-mist transition-colors"
                aria-label={`Open bag${cart.count ? ` (${cart.count} items)` : ''}`}
              >
                <ShoppingBag size={18} strokeWidth={1.9} />
                <AnimatePresence>
                  {cart.count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute top-0.5 right-0.5 grid place-items-center min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-blush-400 text-white text-[0.62rem] font-bold tabular-nums"
                    >
                      {cart.count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <div className="hidden lg:block">
                <AccountMenu />
              </div>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden grid place-items-center w-10 h-10 rounded-full text-ink hover:bg-mist transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileOpen ? 'close' : 'open'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                    {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 top-[72px] z-40 bg-ink/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="lg:hidden fixed top-[72px] inset-x-0 z-40 max-h-[calc(100vh-72px)] overflow-y-auto bg-cream border-b border-hairline"
            >
              <Container className="py-6">
                <MobileLink to="/" icon={PawPrint} onClick={() => setMobileOpen(false)}>Home</MobileLink>

                <p className="px-3 pt-6 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">
                  Services
                </p>
                {services.map(({ to, label, icon: Icon }) => (
                  <MobileLink key={to} to={to} icon={Icon} onClick={() => setMobileOpen(false)}>
                    {label}
                  </MobileLink>
                ))}

                <p className="px-3 pt-6 pb-2 text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">
                  More
                </p>
                {links.map(({ to, label, icon: Icon }) => (
                  <MobileLink key={to} to={to} icon={Icon} onClick={() => setMobileOpen(false)}>
                    {label}
                  </MobileLink>
                ))}

                <div className="mt-6 pt-6 border-t border-hairline">
                  <AccountMenu />
                </div>

                <Link
                  to="/pet-finder"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-full bg-ink text-cream text-sm font-medium"
                >
                  <Search size={16} strokeWidth={2.2} />
                  Find a pet
                </Link>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

const NavItem = ({ to, active, children }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
      ${active ? 'text-ink bg-blush-50' : 'text-ink-soft hover:text-ink hover:bg-mist'}`}
  >
    {children}
  </Link>
);

const MobileLink = ({ to, icon: Icon, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-3 rounded-2xl text-ink hover:bg-mist transition-colors"
  >
    {Icon && (
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-blush-50 text-blush-500">
        <Icon size={17} strokeWidth={2} />
      </span>
    )}
    <span className="text-[0.95rem] font-medium">{children}</span>
  </Link>
);

export default Navbar;
