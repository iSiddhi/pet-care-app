import { motion } from 'framer-motion';
import { fadeUp, stagger, revealOnce } from './motion';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}) => {
  const alignment =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto';

  return (
    <motion.div
      variants={stagger()}
      {...revealOnce}
      className={`flex flex-col ${alignment} max-w-2xl ${className}`}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-blush-500 mb-4"
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-ink"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="mt-5 text-base sm:text-lg leading-relaxed text-ink-soft"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
