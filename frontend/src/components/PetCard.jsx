import { motion } from 'framer-motion';
import { Heart, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { fadeUp } from './ui/motion';

const PetCard = ({ pet, index = 0 }) => {
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const price =
    typeof pet.price === 'number'
      ? `$${pet.price.toLocaleString()}`
      : pet.price;

  return (
    <motion.article
      variants={fadeUp}
      custom={index}
      whileHover="hover"
      initial="rest"
      className="group relative"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-mist">
        {!loaded && <div className="absolute inset-0 shimmer" />}

        <motion.img
          src={pet.image}
          alt={pet.name || pet.breed}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
        />

        {/* Readability scrim, only where text sits */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/55 to-transparent" />

        {/* Save */}
        <button
          onClick={(e) => { e.preventDefault(); setSaved((v) => !v); }}
          className="absolute top-3.5 right-3.5 grid place-items-center w-9 h-9 rounded-full glass text-ink hover:scale-105 active:scale-95 transition-transform"
          aria-label={saved ? 'Remove from saved' : 'Save this pet'}
        >
          <Heart
            size={16}
            strokeWidth={2.2}
            className={saved ? 'fill-blush-500 text-blush-500' : ''}
          />
        </button>

        {/* Breed chip */}
        {pet.breed && (
          <span className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full glass text-[0.7rem] font-semibold tracking-wide text-ink">
            {pet.breed}
          </span>
        )}

        {/* Price */}
        {price && (
          <div className="absolute bottom-3.5 left-4 flex items-baseline gap-1 text-cream">
            <span className="text-lg font-semibold">{price}</span>
            {pet.age && <span className="text-xs opacity-80">· {pet.age}</span>}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.05rem] font-semibold text-ink leading-snug">
            {pet.name || pet.breed}
          </h3>
          <motion.span
            variants={{ rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
            transition={{ duration: 0.25 }}
            className="mt-0.5 text-blush-500 shrink-0"
          >
            <ArrowUpRight size={18} strokeWidth={2.2} />
          </motion.span>
        </div>

        {pet.characteristics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {pet.characteristics.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-xs px-2.5 py-1 rounded-full bg-blush-50 text-blush-600 font-medium"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {pet.description && (
          <p className="mt-3 text-sm text-ink-soft leading-relaxed line-clamp-2">
            {pet.description}
          </p>
        )}
      </div>
    </motion.article>
  );
};

export default PetCard;
