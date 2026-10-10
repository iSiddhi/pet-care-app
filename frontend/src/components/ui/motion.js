// Motion presets.
//
// Deliberately restrained. Animating every section on scroll is the single
// loudest "template" tell -- real products move when you interact with them,
// not when you scroll past them. Keep entrance motion for the first fold and
// for things that genuinely appear (modals, drawers, results); let ordinary
// page sections just be there.

export const EASE = [0.22, 1, 0.36, 1];

// Short travel. 24px reads as decoration; 8px reads as a settle.
export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: EASE } },
};

// Fast stagger. Anything slower turns a six-card grid into a slideshow.
export const stagger = (delayChildren = 0, staggerChildren = 0.04) => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

// Use sparingly: content that is genuinely new on screen, not every section.
export const revealOnce = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, margin: '-40px' },
};

// For sections that should simply be present. Keeps the variants API so
// callers don't branch, but renders immediately with no entrance.
export const still = {
  initial: false,
  animate: 'show',
};
