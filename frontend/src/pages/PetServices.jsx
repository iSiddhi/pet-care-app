import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PawPrint, Cat, Rabbit, Bird, Fish, Turtle,
  SlidersHorizontal, AlertCircle, RotateCcw,
} from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Pill from '../components/ui/Pill';
import PetCard from '../components/PetCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { stagger, EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const CATEGORIES = [
  { name: 'Dog', icon: PawPrint },
  { name: 'Cat', icon: Cat },
  { name: 'Rabbit', icon: Rabbit },
  { name: 'Birds', icon: Bird },
  { name: 'Fish', icon: Fish },
  { name: 'Turtle', icon: Turtle },
];

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
];

const PetServices = () => {
  // The hero search links here with ?type= and ?maxPrice=, and changing a
  // filter writes back to the URL so the view is shareable.
  const [params, setParams] = useSearchParams();
  const urlType = CATEGORIES.some((c) => c.name === params.get('type'))
    ? params.get('type')
    : 'Dog';
  const urlMax = Number(params.get('maxPrice')) || null;

  const [category, setCategory] = useState(urlType);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('featured');
  const [breed, setBreed] = useState('All');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    setBreed('All');

    apiService
      .getPetsByType(category)
      .then((res) => { if (alive) setPets(res.pets || []); })
      .catch(() => {
        if (alive) {
          setPets([]);
          setError("We couldn't load pets just now. Check that the server is running.");
        }
      })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [category]);

  const breeds = useMemo(
    () => ['All', ...new Set(pets.map((p) => p.breed).filter(Boolean))],
    [pets]
  );

  const visible = useMemo(() => {
    let list = breed === 'All' ? pets : pets.filter((p) => p.breed === breed);
    if (maxPrice) list = list.filter((p) => p.price <= maxPrice);
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [pets, breed, sort, maxPrice]);

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="Pet Services"
        title="Pets currently listed"
        subtitle="Every listing is health-screened and priced on the card. Pick a category to filter."
      />

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 glass border-y border-hairline">
        <Container>
          <div className="flex items-center gap-4 py-3">
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CATEGORIES.map(({ name, icon }) => (
                <Pill
                  key={name}
                  icon={icon}
                  active={category === name}
                  onClick={() => {
                    setCategory(name);
                    const next = new URLSearchParams(params);
                    next.set('type', name);
                    setParams(next, { replace: true });
                  }}
                  layoutId="category-pill"
                >
                  {name}
                </Pill>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0 pl-4 border-l border-hairline">
              <SlidersHorizontal size={15} className="text-ink-mute" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-sm font-medium text-ink outline-none cursor-pointer py-2"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </Container>
      </div>

      {/* Breed sub-filter */}
      <Container>
        <AnimatePresence>
          {!loading && breeds.length > 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 pt-6 overflow-x-auto no-scrollbar">
                {breeds.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBreed(b)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm border transition-colors duration-200
                      ${breed === b
                        ? 'border-blush-300 bg-blush-50 text-blush-600 font-medium'
                        : 'border-hairline text-ink-soft hover:border-blush-200 hover:text-ink'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Results */}
      <Container className="pt-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-ink-soft">
            {loading
              ? 'Loading…'
              : `${visible.length} ${visible.length === 1 ? 'pet' : 'pets'} available`}
            {maxPrice && !loading && (
              <span className="text-ink-mute"> · under ${maxPrice}</span>
            )}
          </p>
          {(breed !== 'All' || sort !== 'featured' || maxPrice) && !loading && (
            <button
              onClick={() => {
                setBreed('All');
                setSort('featured');
                setMaxPrice(null);
                const next = new URLSearchParams(params);
                next.delete('maxPrice');
                setParams(next, { replace: true });
              }}
              className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="rounded-3xl border border-hairline bg-shell py-20 px-6 text-center">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-blush-100 text-blush-500 mb-5">
              <AlertCircle size={21} />
            </span>
            <p className="text-ink font-medium mb-2">Something went wrong</p>
            <p className="text-sm text-ink-soft max-w-sm mx-auto mb-7">{error}</p>
            <Button onClick={() => setCategory((c) => c)} variant="outline" size="sm">
              Try again
            </Button>
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-hairline py-20 px-6 text-center">
            <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-mist text-ink-mute mb-5">
              <PawPrint size={21} />
            </span>
            <p className="text-ink font-medium mb-2">Nothing matches that filter</p>
            <p className="text-sm text-ink-soft">Try another breed or category.</p>
          </div>
        ) : (
          <motion.div
            key={`${category}-${breed}-${sort}`}
            variants={stagger(0, 0.07)}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((pet, i) => (
                <motion.div key={pet._id || i} layout>
                  <PetCard pet={pet} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </div>
  );
};

export default PetServices;
