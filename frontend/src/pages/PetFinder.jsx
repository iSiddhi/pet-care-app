import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, PawPrint, AlertCircle, RotateCcw } from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import PetCard from '../components/PetCard';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { stagger, fadeUp, EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const PET_TYPES = ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'];
const MAX_PRICE = 1200;

const PetFinder = () => {
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [breeds, setBreeds] = useState([]);

  const [results, setResults] = useState(null); // null = not searched yet
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Breed list follows the chosen pet type
  useEffect(() => {
    setBreed('');
    if (!petType) { setBreeds([]); return; }

    let alive = true;
    apiService
      .getBreedsByPet(petType)
      .then((res) => { if (alive) setBreeds(res.breeds || []); })
      .catch(() => { if (alive) setBreeds([]); });
    return () => { alive = false; };
  }, [petType]);

  const search = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getPetsByType(petType || undefined);
      let list = res.pets || [];
      if (breed) list = list.filter((p) => p.breed === breed);
      list = list.filter((p) => p.price <= maxPrice);
      setResults(list);
    } catch {
      setResults([]);
      setError("We couldn't reach the server. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPetType('');
    setBreed('');
    setMaxPrice(MAX_PRICE);
    setResults(null);
    setError(null);
  };

  const dirty = petType || breed || maxPrice !== MAX_PRICE;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="Pet Finder"
        title="Find a pet that fits"
        subtitle="Pick a type, breed and budget. We filter the listings against it — no quiz, no email required."
      />

      {/* Filter panel */}
      <Container className="pt-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="rounded-2xl bg-cream border border-hairline shadow-soft p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-7">
            <SlidersHorizontal size={16} className="text-blush-500" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-mute">
              Your preferences
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Pet type">
              <select
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink outline-none focus:ring-2 focus:ring-blush-300 transition-shadow cursor-pointer"
              >
                <option value="">Any pet</option>
                {PET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Breed">
              <select
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                disabled={!petType || breeds.length === 0}
                className="w-full bg-mist rounded-2xl px-4 py-3.5 text-sm text-ink outline-none focus:ring-2 focus:ring-blush-300 transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{petType ? 'Any breed' : 'Pick a pet type first'}</option>
                {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>

            <Field label={`Budget — up to $${maxPrice}`}>
              <div className="px-1 pt-3">
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={50}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-blush-100
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:cursor-grab
                    [&::-webkit-slider-thumb]:shadow-soft
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ink
                    [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between mt-2.5 text-xs text-ink-mute tabular-nums">
                  <span>$0</span>
                  <span>${MAX_PRICE}+</span>
                </div>
              </div>
            </Field>
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <Button onClick={search} size="lg" disabled={loading}>
              <Search size={17} strokeWidth={2.2} />
              {loading ? 'Searching…' : 'Find my match'}
            </Button>
            {dirty && (
              <Button onClick={reset} variant="ghost" size="lg">
                <RotateCcw size={16} />
                Reset
              </Button>
            )}
          </div>
        </motion.div>
      </Container>

      {/* Results */}
      <Container className="pt-14">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SkeletonGrid count={6} />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                tone="error"
                icon={AlertCircle}
                title="Something went wrong"
                body={error}
                actionLabel="Try again"
                onAction={search}
              />
            </motion.div>
          ) : results === null ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <EmptyState
                icon={Search}
                title="Set your preferences above"
                body="Pick what matters to you and hit find — we'll do the rest."
              />
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EmptyState
                icon={PawPrint}
                title="No matches for those filters"
                body="Try widening your budget or choosing a different breed."
                actionLabel="Reset filters"
                onAction={reset}
              />
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm text-ink-soft mb-8">
                {results.length} {results.length === 1 ? 'match' : 'matches'} found
              </p>
              <motion.div
                variants={stagger(0, 0.07)}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              >
                {results.map((pet, i) => (
                  <PetCard key={pet._id || i} pet={pet} index={i} />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-ink mb-2.5">{label}</label>
    {children}
  </div>
);

export default PetFinder;
