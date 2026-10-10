import { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * Same contained treatment as PetCard. The cart control sits in the body as
 * a normal button instead of floating over the photo on hover, so it is
 * visible without hovering and works on touch.
 */
const ProductCard = ({ product }) => {
  const cart = useCart();
  const [loaded, setLoaded] = useState(false);

  const id = product._id || product.id;
  const qty = cart.qtyOf(id);

  return (
    <article className="h-full flex flex-col bg-cream rounded-lg border border-hairline shadow-soft overflow-hidden transition-shadow duration-200 hover:shadow-lift">
      <div className="relative aspect-square bg-mist">
        {!loaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.currentTarget.style.opacity = 0.25; setLoaded(true); }}
          className="w-full h-full object-cover"
        />

        {!product.inStock && (
          <div className="absolute inset-0 bg-cream/75 grid place-items-center">
            <span className="px-3 py-1.5 rounded-full bg-ink text-cream text-xs font-semibold">
              Out of stock
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col p-5">
        <p className="text-xs font-medium text-ink-mute mb-1.5">{product.category}</p>

        <h3 className="text-[0.95rem] font-semibold text-ink leading-snug">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 text-sm text-ink-soft leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
          <span className="text-base font-semibold text-ink tabular-nums">
            ${product.price?.toFixed(2)}
          </span>

          {!product.inStock ? (
            <span className="text-xs text-ink-mute">Unavailable</span>
          ) : qty > 0 ? (
            <div className="flex items-center gap-1 rounded-lg border border-hairline p-0.5">
              <button
                onClick={() => cart.setQty(id, qty - 1)}
                className="grid place-items-center w-7 h-7 rounded-md text-ink-soft hover:bg-mist transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={13} strokeWidth={2.5} />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-ink tabular-nums">
                {qty}
              </span>
              <button
                onClick={() => cart.setQty(id, qty + 1)}
                className="grid place-items-center w-7 h-7 rounded-md text-ink-soft hover:bg-mist transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => cart.add(product)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ink text-cream text-xs font-medium hover:bg-blush-600 transition-colors"
            >
              <ShoppingBag size={14} strokeWidth={2} />
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
