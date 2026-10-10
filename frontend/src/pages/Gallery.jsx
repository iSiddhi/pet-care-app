import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Images, AlertCircle } from 'lucide-react';

import Container from '../components/ui/Container';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { EASE } from '../components/ui/motion';
import { apiService } from '../services/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // index into `visible`

  const load = () => {
    setLoading(true);
    setError(null);
    apiService
      .getGallery()
      .then((list) => setImages(Array.isArray(list) ? list : []))
      .catch(() => {
        setImages([]);
        setError("We couldn't load the gallery. Make sure the server is running.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const categories = useMemo(
    () => ['All', ...new Set(images.map((i) => i.category).filter(Boolean))],
    [images]
  );

  const visible = useMemo(
    () => (category === 'All' ? images : images.filter((i) => i.category === category)),
    [images, category]
  );

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + visible.length) % visible.length)),
    [visible.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % visible.length)),
    [visible.length]
  );

  // Keyboard control for the lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, prev, next]);

  const current = lightbox !== null ? visible[lightbox] : null;

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="Gallery"
        title="Moments from our community"
        subtitle="Photographs sent in by the families who found their companion here."
      />

      {/* Category filter */}
      <Container>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm border transition-colors duration-200
                ${category === c
                  ? 'border-blush-300 bg-blush-50 text-blush-600 font-medium'
                  : 'border-hairline text-ink-soft hover:border-blush-200 hover:text-ink'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </Container>

      {/* Masonry */}
      <Container className="pt-10">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="mb-4 rounded-2xl shimmer break-inside-avoid"
                style={{ height: `${160 + (i % 4) * 60}px` }}
              />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            tone="error"
            icon={AlertCircle}
            title="Something went wrong"
            body={error}
            actionLabel="Try again"
            onAction={load}
          />
        ) : visible.length === 0 ? (
          <EmptyState icon={Images} title="No photos in this category yet" />
        ) : (
          <motion.div
            key={category}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]"
          >
            {visible.map((img, i) => (
              <motion.button
                key={img._id || i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
                }}
                onClick={() => setLightbox(i)}
                className="group relative block w-full mb-4 rounded-2xl overflow-hidden bg-mist break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400 focus-visible:ring-offset-2"
              >
                <img
                  src={img.url}
                  alt={img.caption || 'Gallery photo'}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-colors duration-300" />
                {img.caption && (
                  <span className="absolute bottom-3 left-3 right-3 text-left text-cream text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {img.caption}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-ink/92 backdrop-blur-md grid place-items-center p-4 sm:p-10"
          >
            <button
              onClick={close}
              className="absolute top-5 right-5 grid place-items-center w-11 h-11 rounded-full glass text-ink hover:scale-105 transition-transform"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {visible.length > 1 && (
              <>
                <NavButton side="left" onClick={(e) => { e.stopPropagation(); prev(); }}>
                  <ChevronLeft size={22} />
                </NavButton>
                <NavButton side="right" onClick={(e) => { e.stopPropagation(); next(); }}>
                  <ChevronRight size={22} />
                </NavButton>
              </>
            )}

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full"
            >
              <img
                src={current.url}
                alt={current.caption || 'Gallery photo'}
                className="w-full max-h-[78vh] object-contain rounded-2xl"
              />
              <div className="flex items-center justify-between mt-4 px-1">
                <p className="text-cream text-sm">{current.caption}</p>
                <p className="text-cream/50 text-xs tabular-nums">
                  {lightbox + 1} / {visible.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ side, onClick, children }) => (
  <button
    onClick={onClick}
    className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'}
      grid place-items-center w-11 h-11 rounded-full glass text-ink hover:scale-105 transition-transform z-10`}
    aria-label={side === 'left' ? 'Previous' : 'Next'}
  >
    {children}
  </button>
);

export default Gallery;
