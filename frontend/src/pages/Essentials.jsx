import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PawPrint, Cat, Rabbit, Bird, Fish, Turtle,
  ShoppingBag, PackageX, AlertCircle, RotateCcw,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Pill from '../components/ui/Pill';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/Skeleton';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { stagger, EASE } from '../components/ui/motion';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';

const PET_TABS = [
  { name: 'Dog', icon: PawPrint },
  { name: 'Cat', icon: Cat },
  { name: 'Rabbit', icon: Rabbit },
  { name: 'Birds', icon: Bird },
  { name: 'Fish', icon: Fish },
  { name: 'Turtle', icon: Turtle },
];

const Essentials = () => {
  const [petType, setPetType] = useState('Dog');
  const [category, setCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setCategory('All');

    apiService
      .getEssentials(petType)
      .then((list) => { if (alive) setProducts(list || []); })
      .catch(() => {
        if (alive) {
          setProducts([]);
          setError("We couldn't load products. Make sure the server is running.");
        }
      })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [petType]);

  const categories = useMemo(
    () => ['All', ...new Set(products.map((p) => p.category).filter(Boolean))],
    [products]
  );

  const visible = useMemo(
    () => (category === 'All' ? products : products.filter((p) => p.category === category)),
    [products, category]
  );

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="Essentials"
        title="Pet essentials"
        subtitle="Food, bedding, toys, carriers and care kits. Stock status is shown per item."
      />

      {/* Pet tabs */}
      <div className="sticky top-[72px] z-30 glass border-y border-hairline">
        <Container>
          <div className="flex items-center gap-4 py-3">
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {PET_TABS.map(({ name, icon }) => (
                <Pill
                  key={name}
                  icon={icon}
                  active={petType === name}
                  onClick={() => setPetType(name)}
                  layoutId="essentials-pill"
                >
                  {name}
                </Pill>
              ))}
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative shrink-0 grid place-items-center w-10 h-10 rounded-full border border-hairline text-ink hover:border-blush-300 hover:bg-blush-50 transition-colors"
              aria-label="Open bag"
            >
              <ShoppingBag size={17} strokeWidth={1.9} />
              <AnimatePresence>
                {cart.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 grid place-items-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-blush-400 text-white text-[0.65rem] font-bold tabular-nums"
                  >
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </Container>
      </div>

      {/* Category sub-filter */}
      <Container>
        <AnimatePresence>
          {!loading && categories.length > 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 pt-6 overflow-x-auto no-scrollbar">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm border transition-colors duration-200
                      ${category === c
                        ? 'border-blush-300 bg-blush-50 text-blush-600 font-medium'
                        : 'border-hairline text-ink-soft hover:border-blush-200 hover:text-ink'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Grid */}
      <Container className="pt-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-ink-soft">
            {loading ? 'Loading…' : `${visible.length} ${visible.length === 1 ? 'item' : 'items'}`}
          </p>
          {category !== 'All' && !loading && (
            <button
              onClick={() => setCategory('All')}
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title="Something went wrong"
            body={error}
            actionLabel="Try again"
            onAction={() => setPetType((p) => p)}
          />
        ) : visible.length === 0 ? (
          <EmptyState
            icon={PackageX}
            title="Nothing in this category yet"
            body="Try another category or pet type."
          />
        ) : (
          <motion.div
            key={`${petType}-${category}`}
            variants={stagger(0, 0.06)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-7"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.div key={p._id || p.id} layout>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Essentials;
