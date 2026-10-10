import { motion } from 'framer-motion';
import Container from './Container';
import { fadeUp, stagger } from './motion';

// Shared top band for every inner page, so they all open the same way.
const PageHeader = ({ eyebrow, title, subtitle, children, align = 'left' }) => (
  <section className="relative pt-16 pb-12 sm:pt-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-blush-50 to-cream" />
    <div className="absolute -top-28 right-0 w-96 h-96 rounded-full bg-lilac-100/60 blur-3xl" />
    <div className="absolute -top-16 -left-20 w-80 h-80 rounded-full bg-sage-100/50 blur-3xl" />

    <Container className="relative">
      <motion.div
        variants={stagger(0, 0.08)}
        initial="hidden"
        animate="show"
        className={align === 'center' ? 'max-w-2xl mx-auto text-center' : 'max-w-2xl'}
      >
        {eyebrow && (
          <motion.span
            variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-blush-500"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          variants={fadeUp}
          className="mt-4 text-4xl sm:text-5xl leading-[1.08] text-ink"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            className="mt-5 text-lg text-ink-soft leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <motion.div variants={fadeUp} className="mt-8">{children}</motion.div>}
      </motion.div>
    </Container>
  </section>
);

export default PageHeader;
