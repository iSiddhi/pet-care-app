import { motion } from 'framer-motion';

// Filter chip with a shared layout indicator that slides between options.
const Pill = ({ active, onClick, icon: Icon, children, layoutId = 'pill' }) => (
  <button
    onClick={onClick}
    className={`relative shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full
      text-sm font-medium transition-colors duration-200 whitespace-nowrap
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-400
      focus-visible:ring-offset-2 focus-visible:ring-offset-cream
      ${active ? 'text-cream' : 'text-ink-soft hover:text-ink'}`}
  >
    {active && (
      <motion.span
        layoutId={layoutId}
        className="absolute inset-0 rounded-full bg-ink"
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </span>
  </button>
);

export default Pill;
