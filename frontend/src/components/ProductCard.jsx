import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Minus } from 'lucide-react';
import { fadeUp } from './ui/motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const cart = useCart();
  const [loaded, setLoaded] = useState(false);

  const id = product._id || product.id;
  const qty = cart.qtyOf(id);

  return (
    <motion.article variants={fadeUp} whileHover="hover" initial="rest" className="group">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-mist">
        {!loaded && <div className="absolute inset-0 shimmer" />}

        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { e.currentTarget.style.opacity = 0.25; setLoaded(true); }}
          variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-3.5 left-3.5 px-3 py-1.5 rounded-full glass text-[0.7rem] font-semibold text-ink">
          {product.category}
        </span>

        {!product.inStock && (
          <div className="absolute inset-0 bg-cream/70 backdrop-blur-[2px] grid place-items-center">
            <span className="px-4 py-2 rounded-full bg-ink text-cream text-xs font-semibold">
              Out of stock
            </span>
          </div>
        )}

        {/* Quantity stepper once it's in the cart, otherwise a single add button */}
        {product.inStock && (
          <div className="absolute bottom-3.5 right-3.5">
            {qty > 0 ? (
              <div className="flex items-center gap-1 glass rounded-full p-1">
                <button
                  onClick={() => cart.setQty(id, qty - 1)}
                  className="grid place-items-center w-7 h-7 rounded-full text-ink hover:bg-blush-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} strokeWidth={2.5} />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-ink tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => cart.setQty(id, qty + 1)}
                  className="grid place-items-center w-7 h-7 rounded-full text-ink hover:bg-blush-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={13} strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <motion.button
                onClick={() => cart.add(product)}
                whileTap={{ scale: 0.9 }}
                className="grid place-items-center w-10 h-10 rounded-full bg-ink text-cream shadow-soft opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 transition-all duration-300"
                aria-label={`Add ${product.name} to cart`}
              >
                <Plus size={17} strokeWidth={2.5} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 px-1">
        <h3 className="text-[0.95rem] font-semibold text-ink leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1.5 text-sm text-ink-soft leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-semibold text-ink">
            ${product.price?.toFixed(2)}
          </span>
          {qty > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-sage-300">
              <Check size={13} strokeWidth={2.5} />
              In cart
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
