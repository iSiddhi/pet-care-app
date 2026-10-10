import { useState } from 'react';
import { Heart } from 'lucide-react';

/**
 * A contained card: bordered surface, image on top, everything else in a
 * padded body. Price and breed live in the body as text rather than floating
 * on the photo — that overlay style is what made these read as a listings
 * site rather than a shop.
 */
const PetCard = ({ pet }) => {
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const price = typeof pet.price === 'number' ? `$${pet.price.toLocaleString()}` : pet.price;

  return (
    <article className="h-full flex flex-col bg-cream rounded-lg border border-hairline shadow-soft overflow-hidden transition-shadow duration-200 hover:shadow-lift">
      <div className="relative aspect-[4/3] bg-mist">
        {!loaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={pet.image}
          alt={pet.name || pet.breed}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover"
        />

        <button
          onClick={(e) => { e.preventDefault(); setSaved((v) => !v); }}
          className="absolute top-3 right-3 grid place-items-center w-8 h-8 rounded-full bg-cream/90 border border-hairline text-ink-soft hover:text-blush-500 transition-colors"
          aria-label={saved ? 'Remove from saved' : 'Save this pet'}
        >
          <Heart size={15} strokeWidth={2} className={saved ? 'fill-blush-500 text-blush-500' : ''} />
        </button>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-ink leading-snug">
            {pet.name || pet.breed}
          </h3>
          {price && (
            <span className="text-base font-semibold text-blush-600 tabular-nums whitespace-nowrap">
              {price}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-ink-mute">
          {pet.breed}
          {pet.age && ` · ${pet.age}`}
        </p>

        {pet.characteristics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
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

        <span className="mt-4 pt-4 border-t border-hairline text-sm font-medium text-blush-600">
          View details →
        </span>
      </div>
    </article>
  );
};

export default PetCard;
